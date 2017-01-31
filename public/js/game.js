var GAME = function() {
  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);

  var COLORS = {
    red: BABYLON.Color3.Red(),
    yellow: BABYLON.Color3.Yellow(),
    white: BABYLON.Color3.White(),
    black: BABYLON.Color3.Black()
  };

  // creates a sphere from given config
  var createSphere = function(config) {
    var name = config.id;
    var radius = config.radius;
    var diameter = radius * 2;
    var x = config.position.x;
    var y = config.radius;
    var z = config.position.z;
    var color = COLORS[config.color];

    var material = new BABYLON.StandardMaterial(config.color, this);
    material.diffuseColor = color;

    var sphere = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter, segments: 16 }, this);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    sphere.material = material;
  };

  var createScene = function() {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    camera.attachControl(canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    // create all spheres
    BALLS.forEach(createSphere, scene);

    var ground = BABYLON.MeshBuilder.CreateGround('ground1',{ width: 2.54, height: 1.27, subdivisions: 2 }, scene);

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
