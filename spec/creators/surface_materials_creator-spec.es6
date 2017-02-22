import Scene from '../../src/scene';
import Material from '../../src/objects/material';
import SurfaceMaterialsCreator from '../../src/creators/surface_materials_creator';
import HtmlFixtures from '../support/html_fixtures';

describe('SurfaceMaterialsCreator', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(engine);
  });

  afterEach(function() {
    HtmlFixtures.removeFixture();
  });

  it('can be created with a given scene', function() {
    expect(new SurfaceMaterialsCreator(this.scene)).toEqual(jasmine.any(SurfaceMaterialsCreator));
  });

  it('throws an error if no scene or not an instance of BABYLON.Scene is given when created', function() {
    const scenes = [
      void 0,
      {}
    ];

    scenes.forEach(function(scene) {
      let throwsAnException = () => { new SurfaceMaterialsCreator(scene) };
      expect(throwsAnException).toThrow('SurfaceMaterialsCreator requires an instance of BABYLON.Scene.');
    });

  });
});
