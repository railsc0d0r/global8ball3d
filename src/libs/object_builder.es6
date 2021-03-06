const ObjectBuilder = class{
  static validateScene(scene) {
    if (typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene)) {
      throw "Given object is not a scene.";
    }
  }

  static createBox(boxConfig, scene) {
    this.validateScene(scene);

    const name = boxConfig.name;
    const width = boxConfig.width;
    const height = boxConfig.height;
    const depth = boxConfig.depth;
    const x = boxConfig.position.x;
    const y = boxConfig.position.y;
    const z = boxConfig.position.z;

    let mesh = BABYLON.MeshBuilder.CreateBox(name, {width: width, height: height, depth: depth}, scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  static createSphere(sphereConfig, scene) {
    this.validateScene(scene);

    const name = sphereConfig.name || sphereConfig.id;
    const diameter = sphereConfig.radius * 2;
    const x = sphereConfig.position.x;
    const y = sphereConfig.position.y || sphereConfig.radius;
    const z = sphereConfig.position.z;

    let mesh = BABYLON.MeshBuilder.CreateSphere(name,{ diameter: diameter }, scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  static createCylinder(cylinderConfig, scene) {
    this.validateScene(scene);

    const name = cylinderConfig.name;
    const x = cylinderConfig.position.x;
    const y = cylinderConfig.position.y || 0;
    const z = cylinderConfig.position.z;

    const options = {
      diameterTop: cylinderConfig.diameterTop,
      diameterBottom: cylinderConfig.diameterBottom,
      height: cylinderConfig.height
    };

    let mesh = BABYLON.MeshBuilder.CreateCylinder(name, options, scene);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  static createLine(lineConfig, scene) {
    this.validateScene(scene);

    const name = lineConfig.name;
    const points = lineConfig.points;

    points.forEach(function(point) {
      if (!(point instanceof BABYLON.Vector3)) {
        throw "At least one point given is not a BABYLON.Vector3-object.";
      }
    });

    let mesh = BABYLON.MeshBuilder.CreateLines(name, {points: points}, scene);

    return mesh;
  }

  static createPolyhedron(polyhedronConfig, scene) {
    this.validateScene(scene);

    const name = polyhedronConfig.name;
    const customOptions = {
      vertex: polyhedronConfig.vertex,
      face: polyhedronConfig.face
    };

    let mesh = BABYLON.MeshBuilder.CreatePolyhedron(name, {custom: customOptions}, scene);

    return mesh;
  }

  static convertCsgToMesh(name, csgObject, material, scene) {
    if ( !( typeof name === "string" || name instanceof String ) ) {
      throw "Name given for mesh to be created from CSG-object is not a valid string.";
    }

    if ( typeof(csgObject) === 'undefined' || !( csgObject instanceof BABYLON.CSG ) ) {
      throw "Object given to convert to mesh is not a CSG-object.";
    }

    if ( typeof(material) === 'undefined' || !( material instanceof BABYLON.StandardMaterial ) ) {
      throw "Material given to create a mesh from a CSG-object with is not a Material.";
    }

    this.validateScene(scene);

    return csgObject.toMesh(name, material, scene, false);
  }

  static createPhysicsImpostor(object, impostor_class, options={}, scene) {
    // maps objects to PhysicsImpostor-classes
    const physicsImpostors = {
      SPHERE: 'SphereImpostor',
      BORDER: 'MeshImpostor',
      GROUND: 'BoxImpostor'
    };

    if ( typeof object === 'undefined' || !(object instanceof BABYLON.Mesh) ) {
      throw "Object given to create a PhysicsImpostor for has to be an instance of mesh.";
    }

    if ( typeof impostor_class === 'undefined' || !Object.keys(physicsImpostors).includes(impostor_class) ) {
      throw "You have to define the impostor class to create a PhysicsImpostor from. Possible values are SPHERE, BORDER or GROUND.";
    }

    this.validateScene(scene);

    const impostor = BABYLON.PhysicsImpostor[physicsImpostors[impostor_class]];
    return new BABYLON.PhysicsImpostor(object, impostor, options, scene);
  }

  static createCamera(target, canvas, scene) {
    const alpha = Math.PI;
    const beta = Math.PI / 8 * 3;
    const radius = 3;

    // create a ArcRotateCamera, and set its options
    const camera = new BABYLON.ArcRotateCamera('camera1', alpha, beta, radius, target, scene);

    camera.upperBetaLimit = Math.PI / 2 - Math.PI / 64;
    camera.wheelPrecision = 400;
    camera.lowerRadiusLimit = 0.75;
    camera.upperRadiusLimit = 4;

    // attach the camera to the canvas
    camera.attachControl(canvas, false);

    return camera;
  };

  static frostMaterial(material) {
    if ( typeof material === 'undefined' || !(material instanceof BABYLON.StandardMaterial) ) {
      throw "Given object to be frosted is not a material.";
    }

    material.specularColor = BABYLON.Color3.FromHexString('#333333');
  }
};

export default ObjectBuilder;
