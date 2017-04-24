const Scene = class {
  static create(engine) {
    // create a basic BJS Scene object
    let scene = new BABYLON.Scene(engine);

    // Enables physics w/ a gravity of 9.81 in y-direction and CannonJs as Engine
    scene.enablePhysics();

    // Enables the debug-layer
    scene.debugLayer.show();

    return scene;
  }
};

export default Scene;
