import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import HtmlFixtures from '../support/html_fixtures';

describe('ShadowGenerator', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(this.engine);
    this.light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  it('can be created', function() {
    expect(new ShadowGenerator(this.light)).toEqual(jasmine.any(ShadowGenerator));
  });

  it('requires a light on creation', function() {
    const throwsAnException = () => { new ShadowGenerator };

    expect(throwsAnException).toThrow('A light is required to create a ShadowGenerator.');
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.shadowGenerator = new ShadowGenerator(this.light);
    });

    describe('has a generator', function() {
      beforeEach(function() {
        this.generator = this.shadowGenerator.generator;
      });

      it('which is an instance of BABYLON.ShadowGenerator', function() {
        expect(this.generator).toEqual(jasmine.any(BABYLON.ShadowGenerator));
      });

      it('w/ bias set to 0.0001', function() {
        expect(this.generator.bias).toEqual(0.0001);
      });

      it('w/ Darkness set to 0.18', function() {
        expect(this.generator.getDarkness()).toEqual(0.18);
      });
    });

    it('can push a given object to the renderList of the ShadowMap of the stored ShadowGenerator', function() {
      const renderListSpy = spyOn(this.shadowGenerator.generator.getShadowMap().renderList, 'push');
      const objectWithShadow = {};
      this.shadowGenerator.renderShadowsFrom(objectWithShadow);

      expect(renderListSpy).toHaveBeenCalledWith(objectWithShadow);
    });
  });
});
