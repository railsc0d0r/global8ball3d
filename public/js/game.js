function GAME(balls, borders, holes, rail, cue) {
  // the canvas to render on
  var _canvas;

  // the render-engine
  var _engine;

  // the scene to render
  var _scene;

  // object to hold all surface-materials
  var _surfaceMaterials = {};

  // the cue-stick
  var _cue = {};

  // an array to hold and provide all balls
  var _balls = [];

  // initialize the game
  this.init = function() {
    // the canvas element to render on
    var _canvas = document.getElementById('renderCanvas');

    // the engine used to render the world
    var _engine = new BABYLON.Engine(_canvas, true);

    // call the createScene function
    _scene = _createScene(_engine);
    _scene.debugLayer.show();


    // run the render loop
    _engine.runRenderLoop(function() {
      _scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
      _engine.resize();
    });
  };

  this.getScene = function() {
    return _scene;
  };

  this.getCue = function() {
    return _cue;
  };

  this.getBalls = function() {
    return _balls;
  };

  this.getBreakball = function() {
    return _getBreakball();
  };

  var _createScene = function(engine) {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    // Enables physics w/ a gravity of 9.81 in y-direction and CannonJs as Engine
    scene.enablePhysics();


    _createCamera(engine._renderingCanvas,scene);

    // create a spot-light 2m above the table, looking straight down
    var light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, scene);

    // create surface-materials
    _createSurfaceMaterials(scene);

    // create the playground
    var ground = _createPlayground(scene);

    // creates a shadowGenerator w/ given SpotLight and let ground receive the shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.bias = 0.0001;
    shadowGenerator.setDarkness(0.18);
    ground.receiveShadows = true;

    // create all spheres
    balls.forEach(function(ballConfig) {
      var ball = _createSphere(ballConfig,scene);
      ball.type = ballConfig.type;

      _balls.push(ball);
      shadowGenerator.getShadowMap().renderList.push(ball);
    });

    // create all borders
    borders.forEach(function(border) {
      var borderMesh = _createBorder(border, scene);
      shadowGenerator.getShadowMap().renderList.push(borderMesh);
      borderMesh.receiveShadows = true;
    });

    // create the rail
    var railMesh = _createRail(rail, holes, scene);
    railMesh.receiveShadows = true;

    // create the cue
    _cue = _createCue(cue, _getBreakball(), scene);
    _cue.getDescendants(true).forEach(function(child) {
      shadowGenerator.getShadowMap().renderList.push(child);
    });

    // return the created scene
    return scene;
  };

  var _createCamera = function(canvas,scene) {
    var target = BABYLON.Vector3.Zero();
    var alpha = Math.PI;
    var beta = Math.PI / 8 * 3;
    var radius = 3;

    // create a ArcRotateCamera, and set its options
    var camera = new BABYLON.ArcRotateCamera('camera1', alpha, beta, radius, target, scene);

    camera.upperBetaLimit = Math.PI / 2 - Math.PI / 64;
    camera.wheelPrecision = 400;
    camera.lowerRadiusLimit = 1.5;
    camera.upperRadiusLimit = 4;

    // attach the camera to the canvas
    camera.attachControl(canvas, false);
  };

  // creates alls surface-materials
  var _createSurfaceMaterials = function(scene) {
    var COLORS = {
      red: BABYLON.Color3.Red(),
      yellow: BABYLON.Color3.Yellow(),
      white: BABYLON.Color3.White(),
      black: BABYLON.Color3.Black(),
      blue: BABYLON.Color3.Blue(),
      gray: BABYLON.Color3.Gray(),
      green: BABYLON.Color3.Green(),
      brown: BABYLON.Color3.FromHexString('#331100'),
      lightBrown: BABYLON.Color3.FromHexString('#331100').add(BABYLON.Color3.Gray()),
      lightBlue: BABYLON.Color3.Blue().add(BABYLON.Color3.Gray())
    };

    Object.keys(COLORS).forEach(function(color) {
      var material = new BABYLON.StandardMaterial(color, scene);
      material.diffuseColor = COLORS[color];
      material.backFaceCulling = false;

      _surfaceMaterials[color] = material;
    });
  };

  var _createPlayground = function (scene) {
    var name = 'playground';
    var height = 0.02;

    var box = {
        id: name,
        width: 2.6564,
        height: height,
        depth: 1.3864,
        position: {
          x: 0,
          y: -(height / 2),
          z: 0
        }
    };

    var mesh = _createBox(box, scene);
    var csgPlayground = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    _createCsgHoles(holes,scene).forEach(function(csgHole) {
      csgPlayground.subtractInPlace(csgHole);
    });

    var material = _surfaceMaterials.lightBlue.clone('playground');
    material.specularColor = BABYLON.Color3.FromHexString('#333333');

    var playground = csgPlayground.toMesh(name, material, scene, false);
    playground.physicsImpostor = _createPhysicsImpostor(playground, 'GROUND', { mass: 0, restitution: 0.8 }, scene);

    return playground;
  };

  // creates a polyhedron from given config
  var _createBorder = function(border, scene) {
    var borderVertices = [];
    var borderFaces = [
      [0,1,2],
      [3,4,5],
      [0,1,4,3],
      [0,2,5,3],
      [1,4,5,2]
    ];

    border.vertices.forEach(function(vertex) {
      borderVertices.push([vertex.x, vertex.y, vertex.z]);
    });

    var name = border.id;

    var customOptions = {
      vertex: borderVertices,
      face: borderFaces
    };

    var mesh = BABYLON.MeshBuilder.CreatePolyhedron(name, {custom: customOptions}, scene);

    var material = _surfaceMaterials.blue.clone('border');
    material.specularColor = BABYLON.Color3.FromHexString('#333333');

    mesh.material = material;
    mesh.physicsImpostor = _createPhysicsImpostor(mesh, 'BORDER', { mass: 0, restitution: 0.8 }, scene);

    return mesh;
  };

  // creates another polyhedron from given config
  var _createRail = function(rail, holes, scene) {
    var railBoxes = [];
    var name = "rail";

    rail.forEach(function(box) {
      railBoxes.push(_createBox(box,scene));
    });

    var mesh = BABYLON.Mesh.MergeMeshes(railBoxes);
    var csgRail = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    _createCsgHoles(holes,scene).forEach(function(csgHole) {
      csgRail.subtractInPlace(csgHole);
    });

    var material = _surfaceMaterials.brown.clone('rail');
    material.specularColor = BABYLON.Color3.FromHexString('#333333');
    material.roughness = 1000;

    return csgRail.toMesh(name, material, scene, false);
  };

  // Creates the cue-stick
  var _createCue = function(cue, parent, scene) {
    var name = 'cue';
    var compositeMesh = new BABYLON.Mesh(name, scene);
    compositeMesh.parent = parent;

    cue.forEach(function(cuePart) {
      var mesh = _createCylinder(cuePart, scene);
      var material = _surfaceMaterials[cuePart.color];
      mesh.material = material;
      mesh.parent = compositeMesh;
    });

    compositeMesh.rotation.z = ( Math.PI / 2 - Math.PI / 16);
    compositeMesh.position.x = -0.08;
    compositeMesh.position.y = 0.025;

    return compositeMesh;
  };

  // Creates all holes per given config. These holes are only temporarily added to the scene
  // and used via csg to be subtracted from other meshes. Afterwards they are disposed.
  var _createCsgHoles = function(holes, scene) {
    var csgHoles = []
    holes.forEach(function(hole) {
      csgHoles.push(_createCsgHole(hole, scene));
    });

    return csgHoles;
  };

  // Creates a hole-mesh by given config, sets a position, creates a csg from this mesh and disposes the mesh.
  // Returns the csg-object
  var _createCsgHole = function(hole, scene) {
    hole.diameterTop = hole.radius * 2;
    hole.diameterBottom = hole.radius * 2;
    hole.height = 0.1;
    hole.position.y = 0;

    var mesh = _createCylinder(hole, scene);

    var csg = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    return csg;
  };

  // creates a box by given config
  var _createBox = function(box, scene) {
    var name = box.id;
    var width = box.width;
    var height = box.height;
    var depth = box.depth;
    var x = box.position.x;
    var y = box.position.y;
    var z = box.position.z;

    var mesh = BABYLON.MeshBuilder.CreateBox(name, {width: width, height: height, depth: depth}, scene);
    mesh.position.x = x;
    mesh.position,y = y;
    mesh.position.z = z;

    return mesh;
  };


  // creates a cylinder by given config
  var _createCylinder = function(cylinder, scene) {
    var name = cylinder.id;
    var diameterTop = cylinder.diameterTop;
    var diameterBottom = cylinder.diameterBottom;
    var height = cylinder.height;
    var x = cylinder.position.x;
    var y = cylinder.position.y;
    var z = cylinder.position.z;

    var mesh = BABYLON.MeshBuilder.CreateCylinder(name, {diameterTop: diameterTop, diameterBottom: diameterBottom, height: height}, scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  };

  // creates a sphere from given config
  var _createSphere = function(sphere,scene) {
    var name = sphere.id;
    var radius = sphere.radius;
    var diameter = radius * 2;
    var x = sphere.position.x;
    var y = sphere.position.y || sphere.radius;
    var z = sphere.position.z;
    var material = _surfaceMaterials[sphere.color];
    var mass = sphere.mass;

    var mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.material = material;

    mesh.physicsImpostor = _createPhysicsImpostor(mesh, 'SPHERE', { mass: mass, restitution: 0.98 }, scene);

    return mesh;
  };

  // creates a physicImpostor for a given object
  var _createPhysicsImpostor = function(object, impostor_class, options, scene) {
    // maps objects to PhysicsImpostors
    var physicsImpostors = {
      SPHERE: BABYLON.PhysicsImpostor.SphereImpostor,
      BORDER: BABYLON.PhysicsImpostor.MeshImpostor,
      GROUND: BABYLON.PhysicsImpostor.BoxImpostor
    };

    return new BABYLON.PhysicsImpostor(object, physicsImpostors[impostor_class], options, scene);
  };

  // gets the breakball from _balls
  var _getBreakball = function() {
    return _balls.find(function(ball) {
             return ball.type == 'breakball';
           });
  };
};
