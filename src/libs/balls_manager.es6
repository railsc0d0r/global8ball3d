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

  manageBalls(balls, states) {
    const pendingOperations = this.evaluatePendingOperations(balls, states);

    pendingOperations.create.forEach(ballId => {
      const ballConfig = states.find(state => {
        return state.id === ballId;
      });

      const ball = this.createBall(ballConfig);
      balls.push(ball);
    });

    pendingOperations.update.forEach(ballId => {
      const ball = balls.find(ball => {
        return ball.name === ballId;
      });

      const ballConfig = states.find(state => {
        return state.id === ballId;
      });

      this.updateBall(ball, ballConfig);
    });

    pendingOperations.dispose.forEach(ballId => {
      const ball = balls.find(ball => {
        return ball.name === ballId;
      });

      this.disposeBall(ball);

      const ballIndex = balls.indexOf(ball);
      if(ballIndex != -1) {
        balls.splice(ballIndex, 1);
      }
    });
  }

  createBall(config) {
    let mesh = this.objectBuilder.createSphere(config);

    mesh.material = this.materials.find(material => {
      return material.name === config.color;
    });

    const mass = config.mass;
    const restitution = 0.98;

    mesh.physicsImpostor = this.objectBuilder.createPhysicsImpostor(mesh, "SPHERE", { mass: mass, restitution: restitution});

    this.shadowGenerator.renderShadowsFrom(mesh);

    return mesh;
  }

  updateBall(ball, config) {
    const x = config.position.x;
    const z = config.position.z;

    ball.position.x = x;
    ball.position.z = z;
  }

  disposeBall(ball) {
    ball.dispose();
  }

  evaluatePendingOperations(balls, states) {
    let pendingOperations = {};
    let ballsIds = [];
    let stateIds = [];

    // get the ids of all currently existing balls
    balls.forEach(ball => {
      ballsIds.push(ball.name);
    });

    // get the ids of all balls described in states
    states.forEach(state => {
      stateIds.push(state.id);
    });

    // set the ids of all balls to be created from given state
    pendingOperations.create = stateIds.filter(id => {
      return !ballsIds.includes(id);
    });

    // set the ids of all balls to be updated with given state
    pendingOperations.update = stateIds.filter(id => {
      return ballsIds.includes(id);
    });

    // set the ids of all balls to be disposed
    pendingOperations.dispose = ballsIds.filter(id => {
      return !stateIds.includes(id);
    });

    return pendingOperations;
  }
};

export default BallsManager;
