import CueConfig from '../config/cue_config';

const Cue = class {
  constructor(target, scene) {
    if( typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene) ) {
      throw "Cue requires an instance of BABYLON.Scene to be created.";
    }
  }
};

export default Cue;
