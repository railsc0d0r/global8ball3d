import ObjectBuilder from './object_builder';
import ShadowGenerator from '../models/shadow_generator';

const BallsManager = class {
  constructor(objectBuilder, shadowGenerator) {
    if( typeof(objectBuilder) === 'undefined' || !(objectBuilder instanceof ObjectBuilder) ) {
      throw "BallsManager requires an instance of ObjectBuilder to be created.";
    }

    if( typeof(shadowGenerator) === 'undefined' || !(shadowGenerator instanceof ShadowGenerator) ) {
      throw "BallsManager requires an instance of ShadowGenerator to be created.";
    }

    this.objectBuilder = objectBuilder;
    this.shadowGenerator = shadowGenerator;
  }

};

export default BallsManager;
