const ObjectBuilder = class{
  constructor(scene) {
    if (typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene)) {
      throw "ObjectBuilder requires a scene to be created.";
    }

    this.scene = scene;
  }

  createBox(boxConfig) {
    const name = boxConfig.name;
    const width = boxConfig.width;
    const height = boxConfig.height;
    const depth = boxConfig.depth;
    const x = boxConfig.position.x;
    const y = boxConfig.position.y;
    const z = boxConfig.position.z;

    var mesh = BABYLON.MeshBuilder.CreateBox(name, {width: width, height: height, depth: depth}, this.scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  createSphere(sphereConfig) {
    const name = sphereConfig.name;
    const diameter = sphereConfig.radius * 2;
    const x = sphereConfig.position.x;
    const y = sphereConfig.position.y || sphereConfig.radius;
    const z = sphereConfig.position.z;

    var mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, this.scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  createCylinder(cylinderConfig) {
    const name = cylinderConfig.name;
    const diameterTop = cylinderConfig.diameterTop;
    const diameterBottom = cylinderConfig.diameterBottom;
    const height = cylinderConfig.height;
    const x = cylinderConfig.position.x;
    const y = cylinderConfig.position.y || 0;
    const z = cylinderConfig.position.z;

    var mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameterTop: diameterTop, diameterBottom: diameterBottom, height: height }, this.scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }
};

export default ObjectBuilder;
