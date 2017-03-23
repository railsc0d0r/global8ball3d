import BallsManager from '../../src/libs/balls_manager';
import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';
import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';
import NumberRound from '../support/number_round';

describe('BallsManager', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(this.engine);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  it('requires an instance of ObjectBuilder to be created', function() {
    const throwsAnException = () => new BallsManager;

    expect(throwsAnException).toThrow("BallsManager requires an instance of ObjectBuilder to be created.");
  });

  it('requires an instance of ShadowGenerator to be created', function() {
    const objectBuilder = new ObjectBuilder(this.scene);
    const nonShadowGenerators = NonValues;

    nonShadowGenerators.forEach(nonShadowGenerator => {
      const throwsAnException = () => { new BallsManager(objectBuilder, nonShadowGenerator) };
      expect(throwsAnException).toThrow("BallsManager requires an instance of ShadowGenerator to be created.");
    });
  });

  it('requires an array of materials to be created', function() {
    const objectBuilder = new ObjectBuilder(this.scene);
    const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
    const shadowGenerator = new ShadowGenerator(light);
    const nonArrays = NonValues;

    nonArrays.forEach(nonArray => {
      const throwsAnException = () => { new BallsManager(objectBuilder, shadowGenerator, nonArray) };
      expect(throwsAnException).toThrow("BallsManager requires an array of materials to be created.");
    });
  });

  it('requires given array to contain only materials', function() {
    const objectBuilder = new ObjectBuilder(this.scene);
    const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
    const shadowGenerator = new ShadowGenerator(light);
    const nonValidArrays = [
      [],
      [{}]
    ];

    nonValidArrays.forEach(nonValidArray => {
      const throwsAnException = () => { new BallsManager(objectBuilder, shadowGenerator, nonValidArray) };
      expect(throwsAnException).toThrow("Given array must contain only materials and not be empty.");
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.objectBuilder = new ObjectBuilder(this.scene);
      const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
      this.shadowGenerator = new ShadowGenerator(light);

      const surfaceMaterials = new SurfaceMaterialsCreator(this.scene).surfaceMaterials;
      this.materials = [
        surfaceMaterials.red,
        surfaceMaterials.yellow,
        surfaceMaterials.white,
        surfaceMaterials.black
      ];

      this.ballsManager = new BallsManager(this.objectBuilder, this.shadowGenerator, this.materials);
    });

    it('stores given instance of ObjectBuilder as property', function() {
      expect(this.ballsManager.objectBuilder).toEqual(this.objectBuilder);
    });

    it('stores given instance of ShadowGenerator as property', function() {
      expect(this.ballsManager.shadowGenerator).toEqual(this.shadowGenerator);
    });

    it('stores given array of materials as property', function() {
      expect(this.ballsManager.materials).toEqual(this.materials);
    });

    describe('can create a ball with given config', function() {
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

      it('being a mesh', function() {
        expect(this.ball).toEqual(jasmine.any(BABYLON.Mesh));
      });
    });
  });
});
