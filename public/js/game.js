var GAME = function() {
  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);

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

    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',{ diameter: 0.0582, segments: 16 }, scene);

    // move the sphere upward 1/2 of its height
    sphere.position.y = 0.0291;

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
