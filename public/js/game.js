function GAME(balls, borders, holes) {
  var scene;

  // initialize the game
  this.init = function() {
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
      var customOptions = {
        name: border.id,
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
        blue: BABYLON.Color3.Blue(),
        gray: BABYLON.Color3.Gray(),
        green: BABYLON.Color3.Green()
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
      var ground = BABYLON.MeshBuilder.CreateGround('playground',{ width: 2.54, height: 1.27, subdivisions: 2 }, scene);
      ground.material = surfaceMaterials.gray;
    };

    var createScene = function() {
      // create a basic BJS Scene object
      var scene = new BABYLON.Scene(engine);

      createCamera(scene);

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

      // create surface-materials
      createSurfaceMaterials(scene);

      // create the playground
      createPlayground(scene);

      // create all spheres
      balls.forEach(function(ball) {
        createSphere(ball,scene);
      });

      // create all borders
      borders.forEach(function(border) {
        createBorder(border, scene);
      });

      // return the created scene
      return scene;
    };

    // call the createScene function
    scene = createScene();

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
