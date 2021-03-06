import BallsManager from '../../src/libs/balls_manager';
import BallsConfig from '../../game_config/balls_config';
import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';
import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';

describe('BallsManager', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(this.engine);

    const surfaceMaterials = new SurfaceMaterialsCreator(this.scene).surfaceMaterials;
    this.materials = [
      surfaceMaterials.red,
      surfaceMaterials.yellow,
      surfaceMaterials.white,
      surfaceMaterials.black
    ];

    const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
    this.shadowGenerator = new ShadowGenerator(light);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  it('requires an instance of ShadowGenerator to be created', function() {
    const nonShadowGenerators = NonValues;

    nonShadowGenerators.forEach(nonShadowGenerator => {
      const throwsAnException = () => { new BallsManager(nonShadowGenerator) };
      expect(throwsAnException).toThrow("BallsManager requires an instance of ShadowGenerator to be created.");
    });
  });

  it('requires an array of materials to be created', function() {
    const nonArrays = NonValues;

    nonArrays.forEach(nonArray => {
      const throwsAnException = () => { new BallsManager(this.shadowGenerator, nonArray) };
      expect(throwsAnException).toThrow("BallsManager requires an array of materials to be created.");
    });
  });

  it('requires given array to contain only materials', function() {
    const nonValidArrays = [
      [],
      [{}]
    ];

    nonValidArrays.forEach(nonValidArray => {
      const throwsAnException = () => { new BallsManager(this.shadowGenerator, nonValidArray) };
      expect(throwsAnException).toThrow("Given array must contain only materials and not be empty.");
    });
  });

  it('requires an instance of BABYLON.Scene to be created', function() {
    const nonScenes = NonValues;

    nonScenes.forEach(nonScene => {
      const throwsAnException = () => new BallsManager(this.shadowGenerator, this.materials, nonScene);

      expect(throwsAnException).toThrow("BallsManager requires an instance of BABYLON.Scene to be created.");
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.ballsManager = new BallsManager(this.shadowGenerator, this.materials, this.scene);
    });

    it('stores given instance of ShadowGenerator as property', function() {
      expect(this.ballsManager.shadowGenerator).toEqual(this.shadowGenerator);
    });

    it('stores given array of materials as property', function() {
      expect(this.ballsManager.materials).toEqual(this.materials);
    });

    describe('given a config', function() {
      beforeEach(function() {
        const ballRadius = 0.0291;
        const ballMass = 0.17;

        this.ballConfig = {
          id: 1,
          type: "breakball",
          color: "white",
          radius: ballRadius,
          mass: ballMass,
          position: {
              x: -0.635,
              z: 0
          }
        };

        this.ball = this.ballsManager.createBall(this.ballConfig);
      });

      describe('can create a ball', function() {
        it('being a mesh', function() {
          expect(this.ball).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('with given radius', function() {
          const realRadius = this.ball.getBoundingInfo().boundingBox.extendSize.x;
          expect(realRadius).toEqual(this.ballConfig.radius);
        });

        it('at the given position', function() {
          expect(this.ball.position.x).toEqual(this.ballConfig.position.x);
          expect(this.ball.position.y).toEqual(this.ballConfig.radius);
          expect(this.ball.position.z).toEqual(this.ballConfig.position.z);
        });

        it('with given id', function() {
          expect(this.ball.name).toEqual(this.ballConfig.id);
        });

        it('with given material', function() {
          const expectedMaterial = this.materials.find(material => {
            return material.name === this.ballConfig.color;
          });

          expect(this.ball.material).toEqual(expectedMaterial);
        });

        it('of given type', function() {
          expect(this.ball.type).toEqual(this.ballConfig.type);
        });

        it('with certain physics-attributes', function() {
          expect(this.ball.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
          expect(this.ball.physicsImpostor.getParam("mass")).toEqual(this.ballConfig.mass);
          expect(this.ball.physicsImpostor.getParam("restitution")).toEqual(0.98);
        });

        it('that generates a shadow', function() {
          expect(this.ballsManager.shadowGenerator.renderList).toContain(this.ball);
        });
      });

      describe('can update a ball', function() {
        beforeEach(function() {
          this.ballConfig.position = {
            x: 0.635,
            z: 0.15875
          };

          this.ballsManager.updateBall(this.ball, this.ballConfig);
        });

        it('setting the position given', function() {
          expect(this.ball.position.x).toEqual(this.ballConfig.position.x);
          expect(this.ball.position.y).toEqual(this.ballConfig.radius);
          expect(this.ball.position.z).toEqual(this.ballConfig.position.z);
        });
      });

      describe('can remove a ball', function() {
        beforeEach(function() {
          this.ballsManager.disposeBall(this.ball);
        });

        it('telling BABYLON to dispose the mesh and free resources', function() {
          expect(this.ball.isDisposed()).toBeTruthy();
        });
      });
    });

    describe('with given ballsStates and an array of balls', function() {
      beforeEach(function() {
        this.balls = [];
        BallsConfig.slice(8).forEach(ballConfig => {
          let ball = this.ballsManager.createBall(ballConfig);
          this.balls.push(ball);
        });
        this.ballsConfig = BallsConfig.slice(0,11);
        this.ballsConfig[8].position.x = -0.6864026785002544;
        this.ballsConfig[8].position.z = 0.0281;
      });

      describe('can tell the ids of the balls to', function() {
        beforeEach(function() {
          this.pendingOperations = this.ballsManager.evaluatePendingOperations(this.balls, this.ballsConfig);
        });

        it('create', function() {
          expect(this.pendingOperations.create).toEqual([1,2,3,4,5,6,7,8]);
        });

        it('update', function() {
          expect(this.pendingOperations.update).toEqual([9,10,11]);
        });

        it('dispose', function() {
          expect(this.pendingOperations.dispose).toEqual([12,13,14,15,16]);
        });
      });

      describe('updates the balls', function() {
        beforeEach(function() {
          spyOn(this.ballsManager, 'createBall').and.callThrough();
          spyOn(this.ballsManager, 'updateBall').and.callThrough();
          spyOn(this.ballsManager, 'disposeBall').and.callThrough();
          this.ballsManager.manageBalls(this.balls, this.ballsConfig);

          this.managedBallsIds = this.balls.map(ball => {
            return ball.name
          });
        });

        it('creating the balls not already existing', function() {
          const expectedBallsIds = [1,2,3,4,5,6,7,8];
          expect(this.ballsManager.createBall.calls.count()).toEqual(8);
          expectedBallsIds.forEach(id => {
            expect(this.managedBallsIds).toContain(id);
          });
        });

        it('updating the balls already existing with the position given in state', function() {
          const expectedBallsIds = [9,10,11];
          expect(this.ballsManager.updateBall.calls.count()).toEqual(3);
          expectedBallsIds.forEach(id => {
            const ball = this.balls.find(ball => {
              return ball.name === id;
            });
            const ballConfig = this.ballsConfig.find(config => {
              return config.id === id;
            });
            expect(this.managedBallsIds).toContain(id);
            expect(ball.position.x).toEqual(ballConfig.position.x);
            expect(ball.position.z).toEqual(ballConfig.position.z);
          });
        });

        it('deleting the balls not existing in given states anymore', function() {
          const expectedBallsIds = [12,13,14,15,16];
          expect(this.ballsManager.disposeBall.calls.count()).toEqual(5);
          expectedBallsIds.forEach(id => {
            expect(this.managedBallsIds).not.toContain(id);
          });
        });
      });
    });
  });
});
