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

  describe('as an instance', function() {
    beforeEach(function() {
      this.objectBuilder = new ObjectBuilder(this.scene);
      const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
      this.shadowGenerator = new ShadowGenerator(light);

      this.ballsManager = new BallsManager(this.objectBuilder, this.shadowGenerator);
    });

    it('stores given instance of ObjectBuilder as property', function() {
      expect(this.ballsManager.objectBuilder).toEqual(this.objectBuilder);
    });

    it('stores given instance of ShadowGenerator as property', function() {
      expect(this.ballsManager.shadowGenerator).toEqual(this.shadowGenerator);
    });

  });
});
