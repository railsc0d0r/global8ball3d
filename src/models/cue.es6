import CueConfig from '../config/cue_config';

const Cue = class {
  constructor(target, scene) {
    if( typeof(target) === 'undefined' || !(target instanceof BABYLON.Mesh) ) {
      throw "Cue requires an instance of BABYLON.Mesh as target to be created.";
    }

    if( typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene) ) {
      throw "Cue requires an instance of BABYLON.Scene to be created.";
    }

    this.mesh = new BABYLON.Mesh('cue', scene);
  }
};

export default Cue;
