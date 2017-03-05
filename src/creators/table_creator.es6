import ObjectBuilder from '../object_builder';

const TableCreator = class {
  constructor(objectBuilder) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "TableCreator requires an instance of ObjectBuilder to be created.";
    }

    this.objectBuilder = objectBuilder;
  }

  createCsgHoles(holesConfig) {
    let csgHoles = []
    holesConfig.forEach(holeConfig => {
      csgHoles.push(this.createCsgHole(holeConfig));
    });

    return csgHoles;
  }

  createCsgHole(holeConfig) {
    holeConfig.diameterTop = holeConfig.radius * 2;
    holeConfig.diameterBottom = holeConfig.radius * 2;
    holeConfig.height = 0.1;
    holeConfig.position.y = 0;

    let mesh = this.objectBuilder.createCylinder(holeConfig);

    let csg = BABYLON.CSG.FromMesh(mesh);
    mesh.dispose();

    return csg;
  }

  createPlayground(material, csgHoles) {
    if (typeof(material) === 'undefined' || !(material instanceof BABYLON.StandardMaterial)) {
      throw "A material of type BABYLON.StandardMaterial has to be given to create a playground.";
    }

    const name = 'playground';
    const width = 2.6564;
    const height = 0.02;
    const depth = 1.3864;

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

    csgHoles.forEach(csgHole => {
      csgPlayground.subtractInPlace(csgHole);
    });
  }
};

export default TableCreator;
