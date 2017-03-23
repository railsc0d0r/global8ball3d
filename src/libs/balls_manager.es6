import ObjectBuilder from './object_builder';
import ShadowGenerator from '../models/shadow_generator';

const BallsManager = class {
  constructor(objectBuilder, shadowGenerator, materials) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "BallsManager requires an instance of ObjectBuilder to be created.";
    }

    if( typeof(shadowGenerator) === 'undefined' || !(shadowGenerator instanceof ShadowGenerator) ) {
      throw "BallsManager requires an instance of ShadowGenerator to be created.";
    }

    if( typeof(materials) === 'undefined' || !(materials instanceof Array) ) {
      throw "BallsManager requires an array of materials to be created.";
    }

    this.objectBuilder = objectBuilder;
    this.shadowGenerator = shadowGenerator;
  }

};

export default BallsManager;
