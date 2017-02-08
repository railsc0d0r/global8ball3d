function GAME(balls, borders, holes, rail) {
  var scene;

  // initialize the game
  this.init = function() {
    // the canvas element to render on
    var canvas = document.getElementById('renderCanvas');

    // the engine used to render the world
    var engine = new BABYLON.Engine(canvas, true);

    // object to hold all surface-materials
    var surfaceMaterials = {};

    // maps objects to PhysicsImpostors
    var physicsImpostors = {
        SPHERE: BABYLON.PhysicsImpostor.SphereImpostor,
        BORDER: BABYLON.PhysicsImpostor.MeshImpostor,
        GROUND: BABYLON.PhysicsImpostor.BoxImpostor
    };

    // creates a physicImpostor for a given object
    var createPhysicsImpostor = function(object, impostor_class, options, scene) {
      return new BABYLON.PhysicsImpostor(object, physicsImpostors[impostor_class], options, scene);
    };

    // creates a sphere from given config
    var createSphere = function(ball,scene) {
      var name = ball.id;
      var radius = ball.radius;
      var diameter = radius * 2;
      var x = ball.position.x;
      var y = ball.radius;
      var z = ball.position.z;
      var material = surfaceMaterials[ball.color];
      var mass = ball.mass;

      var sphere = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, scene);
      sphere.position.x = x;
      sphere.position.y = y;
      sphere.position.z = z;
      sphere.material = material;

      sphere.physicsImpostor = createPhysicsImpostor(sphere, 'SPHERE', { mass: mass, restitution: 0.98 }, scene);

      return sphere;
    };

    // Creates all holes per given config. These holes are only temporarily added to the scene
    // and used via csg to be subtracted from other meshes. Afterwards they are disposed.
    var createCsgHoles = function(holes, scene) {
      var csgHoles = []
      holes.forEach(function(hole) {
        csgHoles.push(createCsgHole(hole, scene));
      });

      return csgHoles;
    };

    // Creates a hole-mesh by given config, sets a position, creates a csg from this mesh and disposes the mesh.
    // Returns the csg-object
    var createCsgHole = function(hole, scene) {
      var name = hole.id;
      var diameter = hole.radius * 2;
      var x = hole.position.x;
      var z = hole.position.z;
      var height = 0.1;

      var mesh = BABYLON.MeshBuilder.CreateCylinder(name, {diameter: diameter, height: height}, scene);
      mesh.position.x = x;
      mesh.position.z = z;

      var csg = BABYLON.CSG.FromMesh(mesh);
      mesh.dispose();

      return csg;
    };

    // creates a polyhedron from given config
    var createBorder = function(border, scene) {
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

      var border = BABYLON.MeshBuilder.CreatePolyhedron(name, {custom: customOptions}, scene);
      border.material = surfaceMaterials.blue;
      border.physicsImpostor = createPhysicsImpostor(border, 'BORDER', { mass: 0, restitution: 0.8 }, scene);

      return border;
    };

    // creates a box by given config
    var createBox = function(box, scene) {
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

    // creates another polyhedron from given config
    var createRail = function(rail, holes, scene) {
      var railBoxes = [];
      var name = "rail";

      rail.forEach(function(box) {
        railBoxes.push(createBox(box,scene));
      });

      var mesh = BABYLON.Mesh.MergeMeshes(railBoxes);
      var csgRail = BABYLON.CSG.FromMesh(mesh);
      mesh.dispose();

      var csgHoles = createCsgHoles(holes,scene);

      csgHoles.forEach(function(csgHole) {
        csgRail.subtractInPlace(csgHole);
      });

      csgRail.toMesh(name, surfaceMaterials.brown, scene, false);
    };

    // creates alls surface-materials
    var createSurfaceMaterials = function(scene) {
      var COLORS = {
        red: BABYLON.Color3.Red(),
        yellow: BABYLON.Color3.Yellow(),
        white: BABYLON.Color3.White(),
        black: BABYLON.Color3.Black(),
        blue: BABYLON.Color3.Blue(),
        gray: BABYLON.Color3.Gray(),
        green: BABYLON.Color3.Green(),
        brown: BABYLON.Color3.FromHexString('#331100'),
        lightBlue: BABYLON.Color3.Blue().add(BABYLON.Color3.Gray())
      };

      Object.keys(COLORS).forEach(function(color) {
        var material = new BABYLON.StandardMaterial(color, scene);
        material.diffuseColor = COLORS[color];
        material.backFaceCulling = false;

        surfaceMaterials[color] = material;
      });
    };

    var createCamera = function(scene) {
      var target = BABYLON.Vector3.Zero();
      var alpha = Math.PI;
      var beta = Math.PI / 8 * 3;
      var radius = 3;

      // create a ArcRotateCamera, and set its options
      var camera = new BABYLON.ArcRotateCamera('camera1', alpha, beta, radius, target, scene);

      camera.upperBetaLimit = Math.PI / 2;
      camera.zoomOnFactor = 0.1;

      // attach the camera to the canvas
      camera.attachControl(canvas, false);
    };

    var createPlayground = function (scene) {
      var name = 'playground';
      var mesh = BABYLON.MeshBuilder.CreateGround(name, { width: 2.6564, height: 1.3864 }, scene);
      var csgPlayground = BABYLON.CSG.FromMesh(mesh);
      mesh.dispose();

      var csgHoles = createCsgHoles(holes,scene);

      csgHoles.forEach(function(csgHole) {
        csgPlayground.subtractInPlace(csgHole);
      });

      var playground = csgPlayground.toMesh(name, surfaceMaterials.lightBlue, scene, false);
      playground.physicsImpostor = createPhysicsImpostor(playground, 'GROUND', { mass: 0, restitution: 0.8 }, scene);

      return playground;
    };

    var createScene = function() {
      // create a basic BJS Scene object
      var scene = new BABYLON.Scene(engine);

      // Enables physics w/ a gravity of 9.81 in y-direction and CannonJs as Engine
      scene.enablePhysics();


      createCamera(scene);

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      var light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, scene);

      // create surface-materials
      createSurfaceMaterials(scene);

      // create the playground
      var ground = createPlayground(scene);

      // creates a shadowGenerator w/ given SpotLight and let ground receive the shadows
      var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      shadowGenerator.bias = 0.0001;
      shadowGenerator.setDarkness(0.18);
      ground.receiveShadows = true;

      // create all spheres
      balls.forEach(function(ball) {
        shadowGenerator.getShadowMap().renderList.push(createSphere(ball,scene));
      });

      // create all borders
      borders.forEach(function(border) {
        shadowGenerator.getShadowMap().renderList.push(createBorder(border, scene));
      });

      // create the rail
      createRail(rail, holes, scene);

      // return the created scene
      return scene;
    };

    // call the createScene function
    scene = createScene();
    scene.debugLayer.show();


    // run the render loop
    engine.runRenderLoop(function() {
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
      engine.resize();
    });
  };

  this.getScene = function() {
    return scene;
  };
};
