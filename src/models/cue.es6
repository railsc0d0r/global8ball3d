import CueConfig from '../config/cue_config';
import ObjectBuilder from '../libs/object_builder';
import ShadowGenerator from '../models/shadow_generator';

const Cue = class {
  constructor(target, shadowGenerator, materials, scene) {
    if( typeof(target) === 'undefined' || !(target instanceof BABYLON.Mesh) ) {
      throw "Cue requires an instance of BABYLON.Mesh as target to be created.";
    }

    if( typeof(shadowGenerator) === 'undefined' || !(shadowGenerator instanceof ShadowGenerator) ) {
      throw "Cue requires an instance of ShadowGenerator to be created.";
    }

    if( typeof(materials) === 'undefined' || !(materials instanceof Array) ) {
      throw "Cue requires an array of materials to be created.";
    }

    // validates if given array of materials is not empty and contains only materials
    let containsOnlyMaterials = true;

    materials.forEach(material => {
      if (!(material instanceof BABYLON.StandardMaterial)) {
        containsOnlyMaterials = false;
      }
    });

    if ( materials.length === 0 || !containsOnlyMaterials ) {
      throw "Given array must contain only materials and not be empty.";
    }

    if( typeof(scene) === 'undefined' || !(scene instanceof BABYLON.Scene) ) {
      throw "Cue requires an instance of BABYLON.Scene to be created.";
    }

    this.mesh = new BABYLON.Mesh('cue', scene);
    this._createCueParts(shadowGenerator, materials, scene);

    const pivotAt = target.position;
    const startPosition = new BABYLON.Vector3(pivotAt.x, pivotAt.y, pivotAt.z + 0.08);

    const radiusV3 = startPosition.subtract(pivotAt);

    this.mesh.position = startPosition;
    this.mesh.setPivotMatrix(BABYLON.Matrix.Translation(-radiusV3.x, -radiusV3.y, -radiusV3.z));
    this.mesh.position = startPosition;

    this._alpha = 0;
    this._beta = 0;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(value) {
    this._alpha = value;
  }

  get beta() {
    return this._beta;
  }

  _createCueParts(shadowGenerator, materials, scene) {
    let axisPoints = [];
    const distanceFromTarget = 0.08;

    CueConfig.forEach(configPart => {
      const axisPoint = new BABYLON.Vector3(configPart.position.x, configPart.position.y, configPart.position.z);
      axisPoints.push(axisPoint);
      axisPoints.push(axisPoint.scale(-distanceFromTarget));

      const mesh = ObjectBuilder.createCylinder(configPart, scene);

      const material = materials.find(material => {
        return material.name == configPart.color;
      });
      mesh.material = material;
      shadowGenerator.renderShadowsFrom(mesh);

      mesh.parent = this.mesh;
    });

    const lineConfig = {
      name: 'cueAxis',
      points: axisPoints
    };

    let axis = ObjectBuilder.createLine(lineConfig, scene);
    axis.color = BABYLON.Color3.Red();
    shadowGenerator.renderShadowsFrom(axis);

    axis.parent = this.mesh;
  }
};

export default Cue;
