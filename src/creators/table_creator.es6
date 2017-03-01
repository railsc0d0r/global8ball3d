import ObjectBuilder from '../object_builder';

const TableCreator = class {
  constructor(objectBuilder) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "TableCreator requires an instance of ObjectBuilder to be created.";
    }
  }
};

export default TableCreator;
