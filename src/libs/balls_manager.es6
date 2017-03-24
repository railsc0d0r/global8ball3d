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

    let containsOnlyMaterials = true;

    materials.forEach(material => {
      if (!(material instanceof BABYLON.StandardMaterial)) {
        containsOnlyMaterials = false;
      }
    });

    if ( materials.length === 0 || !containsOnlyMaterials ) {
      throw "Given array must contain only materials and not be empty.";
    }

    this.objectBuilder = objectBuilder;
    this.shadowGenerator = shadowGenerator;
    this.materials = materials;
  }

  createBall(config) {
    let mesh = this.objectBuilder.createSphere(config);

    mesh.material = this.materials.find(material => {
      return material.name === config.color;
    });

    const mass = config.mass;
    const restitution = 0.98;

    mesh.physicsImpostor = this.objectBuilder.createPhysicsImpostor(mesh, "SPHERE", { mass: mass, restitution: restitution});

    return mesh;
  }

};

export default BallsManager;
