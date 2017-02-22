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
});
