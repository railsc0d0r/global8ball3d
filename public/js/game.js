var GAME = function() {
  // the canvas element to render on
  var canvas = document.getElementById('renderCanvas');

  // the engine used to render the world
  var engine = new BABYLON.Engine(canvas, true);

  // object to hold all surface-materials
  var surfaceMaterials = {};

  // creates a sphere from given config
  var createSphere = function(ball,scene) {
    var name = ball.id;
    var radius = ball.radius;
    var diameter = radius * 2;
    var x = ball.position.x;
    var y = ball.radius;
    var z = ball.position.z;
    var material = surfaceMaterials[ball.color];

    var sphere = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, scene);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    sphere.material = material;
  };

  // creates a polyhedron from given config
  var createBorder = function(name, vertices, scene) {
    var borderVertices = [];
    var borderFaces = [
      [0,1,2],
      [3,4,5],
      [0,1,4,3],
      [0,2,5,3],
      [1,4,5,2]
    ];

    vertices.forEach(function(vertex) {
      borderVertices.push([vertex.x, vertex.y, vertex.z]);
    });
    var customOptions = {
      name: name,
      vertex: borderVertices,
      face: borderFaces
    };

    var border = BABYLON.MeshBuilder.CreatePolyhedron(name, {custom: customOptions}, scene);
    border.material = surfaceMaterials.blue;
  };

  // creates alls surface-materials
  var createSurfaceMaterials = function(scene) {
    var COLORS = {
      red: BABYLON.Color3.Red(),
      yellow: BABYLON.Color3.Yellow(),
      white: BABYLON.Color3.White(),
      black: BABYLON.Color3.Black(),
      blue: BABYLON.Color3.Blue()
    };

    Object.keys(COLORS).forEach(function(color) {
      var material = new BABYLON.StandardMaterial(color, scene);
      material.diffuseColor = COLORS[color];

      surfaceMaterials[color] = material;
    });
  };

  var createScene = function() {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 1.5,-1.5), scene);

    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    camera.attachControl(canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    // create surface-materials
    createSurfaceMaterials(scene);

    // create all spheres
    BALLS.forEach(function(ball) {
      createSphere(ball,scene);
    });

    // create all borders
    Object.keys(BORDERS).forEach(function(border) {
      createBorder(border, BORDERS[border], scene);
    });

    var ground = BABYLON.MeshBuilder.CreateGround('ground1',{ width: 2.54, height: 1.27, subdivisions: 2 }, scene);

    ground.material = surfaceMaterials.blue;

    // return the created scene
    return scene;
  };

  // call the createScene function
  var scene = createScene();

  // run the render loop
  engine.runRenderLoop(function() {
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', function(){
    engine.resize();
  });
}
