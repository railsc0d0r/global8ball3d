const SurfaceMaterialsCreator = class {
  constructor(scene) {
    if (typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene)) {
      throw "SurfaceMaterialsCreator requires an instance of BABYLON.Scene.";
    }
  }
};

export default SurfaceMaterialsCreator;
