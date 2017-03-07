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

    let mesh = BABYLON.MeshBuilder.CreateBox(name, {width: width, height: height, depth: depth}, this.scene);
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

    let mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, this.scene);
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

    let mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameterTop: diameterTop, diameterBottom: diameterBottom, height: height }, this.scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  createLine(lineConfig) {
    const name = lineConfig.name;
    const points = lineConfig.points;

    points.forEach(function(point) {
      if (!(point instanceof BABYLON.Vector3)) {
        throw "At least one point given is not a BABYLON.Vector3-object.";
      }
    });

    let mesh = BABYLON.MeshBuilder.CreateLines(name, {points: points}, this.scene);

    return mesh;
  }

  convertCsgToMesh(name, csgObject, material) {
    if ( !( typeof name === "string" || name instanceof String ) ) {
      throw "Name given for mesh to be created from CSG-object is not a valid string.";
    }

    if ( typeof(csgObject) === 'undefined' || !( csgObject instanceof BABYLON.CSG ) ) {
      throw "Object given to convert to mesh is not a CSG-object.";
    }

    if ( typeof(material) === 'undefined' || !( material instanceof BABYLON.StandardMaterial ) ) {
      throw "Material given to create a mesh from a CSG-object with is not a Material.";
    }

    return csgObject.toMesh(name, material, this.scene, false);
  }

  createPhysicsImpostor(object, impostor_class, options={}) {
    // maps objects to PhysicsImpostor-classes
    const physicsImpostors = {
      SPHERE: BABYLON.PhysicsImpostor.SphereImpostor,
      BORDER: BABYLON.PhysicsImpostor.MeshImpostor,
      GROUND: BABYLON.PhysicsImpostor.BoxImpostor
    };

    if ( typeof object === 'undefined' || !(object instanceof BABYLON.Mesh) ) {
      throw "Object given to create a PhysicsImpostor for has to be an instance of mesh.";
    }

    if ( typeof impostor_class === 'undefined' || !Object.keys(physicsImpostors).includes(impostor_class) ) {
      throw "You have to define the impostor class to create a PhysicsImpostor from. Possible values are SPHERE, BORDER or GROUND.";
    }

    return new BABYLON.PhysicsImpostor(object, physicsImpostors[impostor_class], options, this.scene);
  };
};

export default ObjectBuilder;
