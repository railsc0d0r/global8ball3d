import ObjectBuilder from './object_builder';
import ShadowGenerator from '../models/shadow_generator';

const TableCreator = class {
  constructor(objectBuilder, shadowGenerator) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "TableCreator requires an instance of ObjectBuilder to be created.";
    }

    if( typeof(shadowGenerator) === 'undefined' || !(shadowGenerator instanceof ShadowGenerator) ) {
      throw "TableCreator requires an instance of ShadowGenerator to be created.";
    }

    this.objectBuilder = objectBuilder;
    this.shadowGenerator = shadowGenerator;
  }

  static createCsgHoles(config, objectBuilder) {
    this.validateObjectBuilder(objectBuilder);

    const csgHoles = [];
    config.holesConfig.forEach(holeConfig => {
      csgHoles.push(TableCreator._createCsgHole(holeConfig, objectBuilder));
    });

    return csgHoles;
  }

  static _createCsgHole(holeConfig, objectBuilder) {
    holeConfig.diameterTop = holeConfig.radius * 2;
    holeConfig.diameterBottom = holeConfig.radius * 2;
    holeConfig.height = 0.1;
    holeConfig.position.y = 0;

    const mesh = objectBuilder.createCylinder(holeConfig);

    const csg = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    return csg;
  }

  static validateObjectBuilder(objectBuilder) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "Given object is not an instance of ObjectBuilder.";
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

  static createPlayground(config, material, objectBuilder) {
    this.validateConfig(config);
    this.validateMaterial(material);
    this.validateObjectBuilder(objectBuilder);

    let playgroundMaterial = material.clone('playground');
    objectBuilder.frostMaterial(playgroundMaterial);

    const playgroundConfig = config.playgroundConfig;

    const name = playgroundConfig.id;
    const width = playgroundConfig.width;
    const height = playgroundConfig.height;
    const depth = playgroundConfig.depth;
    const mass = playgroundConfig.mass;
    const restitution = playgroundConfig.restitution;
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

    // creates the CSG-representation of the playground
    let mesh = objectBuilder.createBox(boxConfig);
    let csgPlayground = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    const csgHoles = this.createCsgHoles(config, objectBuilder);

    // drills the holes
    csgHoles.forEach(csgHole => {
      csgPlayground.subtractInPlace(csgHole);
    });

    let playground = objectBuilder.convertCsgToMesh(name, csgPlayground, playgroundMaterial);
    playground.physicsImpostor = objectBuilder.createPhysicsImpostor(playground, "GROUND", { mass: mass, restitution: restitution});
    playground.receiveShadows = true;

    return playground;
  }

  createBorders(borderConfigs, material) {
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


    borderConfigs.forEach(borderConfig => {
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

      let border = this.objectBuilder.createPolyhedron(polyhedronConfig);

      border.material = borderMaterial;
      border.physicsImpostor = this.objectBuilder.createPhysicsImpostor(border, "BORDER", physicsConfig);

      this.shadowGenerator.renderShadowsFrom(border);
      border.receiveShadows = true;

      borders.push(border);
    });

    return borders;
  }

  createRail(railConfig, material) {
    let railBoxes = [];
    const name = "rail";
    const mass = railConfig.mass;
    const restitution = railConfig.restitution;

    let railMaterial = material.clone(name);
    railMaterial.specularColor = BABYLON.Color3.FromHexString('#333333');

    railConfig.boxes.forEach(box => {
      railBoxes.push(this.objectBuilder.createBox(box));
    });

    // creates the CSG-representation of the rail
    let mesh = BABYLON.Mesh.MergeMeshes(railBoxes);
    let csgRail = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    // drills the holes
    this.csgHoles.forEach(csgHole => {
      csgRail.subtractInPlace(csgHole);
    });

    let rail = this.objectBuilder.convertCsgToMesh(name, csgRail, railMaterial);
    rail.physicsImpostor = this.objectBuilder.createPhysicsImpostor(rail, "BORDER", { mass: mass, restitution: restitution});
    rail.receiveShadows = true;

    return rail;
  }
};

export default TableCreator;
