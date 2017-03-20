const Material = class {
  static createColor(name, color, scene) {
    let material = new BABYLON.StandardMaterial(name, scene);
    material.diffuseColor = color;
    material.backFaceCulling = false;

    return material;
  }
};

export default Material;
