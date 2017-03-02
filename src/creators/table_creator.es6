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
};

export default TableCreator;
