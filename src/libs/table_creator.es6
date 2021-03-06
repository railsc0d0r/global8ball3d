import ObjectBuilder from './object_builder';
import ShadowGenerator from '../models/shadow_generator';

const TableCreator = class {
  static createCsgHoles(config, scene) {
    this.validateScene(scene);

    const csgHoles = [];
    config.holesConfig.forEach(holeConfig => {
      csgHoles.push(TableCreator._createCsgHole(holeConfig, scene));
    });

    return csgHoles;
  }

  static _createCsgHole(holeConfig, scene) {
    this.validateScene(scene);

    holeConfig.height = 0.1;
    holeConfig.position.y = 0;
    holeConfig.diameterTop = holeConfig.diameter;
    holeConfig.diameterBottom = holeConfig.diameter;

    const mesh = ObjectBuilder.createCylinder(holeConfig, scene);

    const csg = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    return csg;
  }

  static validateScene(scene) {
    if( typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene) ) {
      throw "Given object is not an instance of BABYLON.Scene.";
    }
  }

  static validateShadowGenerator(shadowGenerator) {
    if( typeof(shadowGenerator) === 'undefined' || !(shadowGenerator instanceof ShadowGenerator) ) {
      throw "Given object is not an instance of ShadowGenerator.";
    }
  }

  static validateConfig(config) {
    if ( typeof(config) === 'undefined' || Object.keys(config).length === 0 ) {
      throw "Given config is not valid. It has to be a hash of config-options describing the borders, holes, playground and the rail.";
    }
  }

  static validateMaterial(material) {
    if (typeof(material) === 'undefined' || !(material instanceof BABYLON.StandardMaterial)) {
      throw "Given material is not valid. Expected an object of type BABYLON.StandardMaterial.";
    }
  }

  static createPlayground(config, material, scene) {
    this.validateConfig(config);
    this.validateMaterial(material);
    this.validateScene(scene);

    let playgroundMaterial = material.clone('playground');
    ObjectBuilder.frostMaterial(playgroundMaterial);

    const playgroundConfig = config.playgroundConfig;

    const name = playgroundConfig.id;
    const width = playgroundConfig.width;
    const height = playgroundConfig.height;
    const depth = playgroundConfig.depth;
    const x = playgroundConfig.position.x;
    const y = playgroundConfig.position.y;
    const z = playgroundConfig.position.z;

    const boxConfig = {
        id: name,
        width: width,
        height: height,
        depth: depth,
        position: {
          x: x,
          y: y,
          z: z
        }
    };

    const physicsOptions = {
      mass: playgroundConfig.mass,
      restitution: playgroundConfig.restitution,
      friction: playgroundConfig.friction
    };

    // creates the CSG-representation of the playground
    let mesh = ObjectBuilder.createBox(boxConfig, scene);
    let csgPlayground = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    const csgHoles = this.createCsgHoles(config, scene);

    // drills the holes
    csgHoles.forEach(csgHole => {
      csgPlayground.subtractInPlace(csgHole);
    });

    let playground = ObjectBuilder.convertCsgToMesh(name, csgPlayground, playgroundMaterial, scene);
    playground.physicsImpostor = ObjectBuilder.createPhysicsImpostor(playground, "GROUND", physicsOptions, scene);
    playground.receiveShadows = true;

    return playground;
  }

  static createBorders(config, material, shadowGenerator, scene) {
    this.validateConfig(config);
    this.validateMaterial(material);
    this.validateShadowGenerator(shadowGenerator);
    this.validateScene(scene);

    let borders = [];

    const borderFaces = [
      [0,1,2],
      [3,4,5],
      [0,1,4,3],
      [0,2,5,3],
      [1,4,5,2]
    ];

    const borderMaterial = material.clone('border');
    borderMaterial.specularColor = BABYLON.Color3.FromHexString('#333333');

    const physicsConfig = {
      mass: 0,
      restitution: 0.8
    };


    config.bordersConfig.forEach(borderConfig => {
      let borderVertices = [];

      borderConfig.vertices.forEach(vertex => {
        borderVertices.push([vertex.x, vertex.y, vertex.z]);
      });

      const name = borderConfig.id;

      const polyhedronConfig = {
        name: name,
        vertex: borderVertices,
        face: borderFaces
      };

      let border = ObjectBuilder.createPolyhedron(polyhedronConfig, scene);

      border.material = borderMaterial;
      border.physicsImpostor = ObjectBuilder.createPhysicsImpostor(border, "BORDER", physicsConfig, scene);

      shadowGenerator.renderShadowsFrom(border);
      border.receiveShadows = true;

      borders.push(border);
    });

    return borders;
  }

  static createRail(config, material, scene) {
    this.validateConfig(config);
    this.validateMaterial(material);
    this.validateScene(scene);

    const railConfig = config.railConfig;

    let railBoxes = [];
    const name = "rail";
    const mass = railConfig.mass;
    const restitution = railConfig.restitution;

    let railMaterial = material.clone(name);
    railMaterial.specularColor = BABYLON.Color3.FromHexString('#333333');

    railConfig.boxes.forEach(boxConfig => {
      railBoxes.push(ObjectBuilder.createBox(boxConfig, scene));
    });

    // creates the CSG-representation of the rail
    let mesh = BABYLON.Mesh.MergeMeshes(railBoxes);
    let csgRail = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    const csgHoles = this.createCsgHoles(config, scene);

    // drills the holes
    csgHoles.forEach(csgHole => {
      csgRail.subtractInPlace(csgHole);
    });

    let rail = ObjectBuilder.convertCsgToMesh(name, csgRail, railMaterial, scene);
    rail.physicsImpostor = ObjectBuilder.createPhysicsImpostor(rail, "BORDER", { mass: mass, restitution: restitution}, scene);
    rail.receiveShadows = true;

    return rail;
  }
};

export default TableCreator;
