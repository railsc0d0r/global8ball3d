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

    this.shadowGenerator = shadowGenerator;
    this.materials = materials;

    this.mesh = new BABYLON.Mesh('cue', scene);
    this._createCueParts(shadowGenerator, materials, scene);
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
