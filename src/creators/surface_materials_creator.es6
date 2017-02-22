import Material from '../objects/material';

const SurfaceMaterialsCreator = class {
  constructor(scene) {
    if (typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene)) {
      throw "SurfaceMaterialsCreator requires an instance of BABYLON.Scene.";
    }

    this.surfaceMaterials = {};

    const colors = {
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

    Object.keys(colors).forEach(color => {
      this.surfaceMaterials[color] = Material.createColor(color, colors[color], scene);
    });
  }
};

export default SurfaceMaterialsCreator;
