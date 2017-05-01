import CueConfig from '../config/cue_config';
import ObjectBuilder from '../libs/object_builder';

const Cue = class {
  constructor(target, scene) {
    if( typeof(target) === 'undefined' || !(target instanceof BABYLON.Mesh) ) {
      throw "Cue requires an instance of BABYLON.Mesh as target to be created.";
    }

    if( typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene) ) {
      throw "Cue requires an instance of BABYLON.Scene to be created.";
    }

    this.mesh = new BABYLON.Mesh('cue', scene);
    this._createCueParts(scene);
  }

  _createCueParts(scene) {
    let axisPoints = [];
    const distanceFromTarget = 0.08;

    CueConfig.forEach(configPart => {
      const axisPoint = new BABYLON.Vector3(configPart.position.x, configPart.position.y, configPart.position.z);
      axisPoints.push(axisPoint);
      axisPoints.push(axisPoint.scale(-distanceFromTarget));

      const mesh = ObjectBuilder.createCylinder(configPart, scene);
      mesh.parent = this.mesh;
    });

    const lineConfig = {
      name: 'cueAxis',
      points: axisPoints
    };

    let axis = ObjectBuilder.createLine(lineConfig, scene);
    axis.color = BABYLON.Color3.Red();
    axis.parent = this.mesh;
  }
};

export default Cue;
