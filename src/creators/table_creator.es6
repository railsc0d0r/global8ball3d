import ObjectBuilder from '../object_builder';
import ShadowGenerator from '../objects/shadow_generator';

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
    this.csgHoles = [];
  }

  createCsgHoles(holesConfig) {
    holesConfig.forEach(holeConfig => {
      this.csgHoles.push(this._createCsgHole(holeConfig));
    });
  }

  _createCsgHole(holeConfig) {
    holeConfig.diameterTop = holeConfig.radius * 2;
    holeConfig.diameterBottom = holeConfig.radius * 2;
    holeConfig.height = 0.1;
    holeConfig.position.y = 0;

    let mesh = this.objectBuilder.createCylinder(holeConfig);

    let csg = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    return csg;
  }

  createPlayground(material) {
    if (typeof(material) === 'undefined' || !(material instanceof BABYLON.StandardMaterial)) {
      throw "A material of type BABYLON.StandardMaterial has to be given to create a playground.";
    }

    let playgroundMaterial = material.clone('playground');
    playgroundMaterial.specularColor = BABYLON.Color3.FromHexString('#333333');

    const name = 'playground';
    const width = 2.6564;
    const height = 0.02;
    const depth = 1.3864;
    const mass = 0;
    const restitution = 0.98;

    const boxConfig = {
        id: name,
        width: width,
        height: height,
        depth: depth,
        position: {
          x: 0,
          y: -(height / 2),
          z: 0
        }
    };

    let mesh = this.objectBuilder.createBox(boxConfig);
    let csgPlayground = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    this.csgHoles.forEach(csgHole => {
      csgPlayground.subtractInPlace(csgHole);
    });

    let playground = this.objectBuilder.convertCsgToMesh(name, csgPlayground, playgroundMaterial);
    playground.physicsImpostor = this.objectBuilder.createPhysicsImpostor(playground, "GROUND", { mass: mass, restitution: restitution});
    playground.receiveShadows = true;

    return playground;
  }
};

export default TableCreator;
