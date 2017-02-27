import Scene from '../../src/scene';
import Material from '../../src/objects/material';
import HtmlFixtures from '../support/html_fixtures';

describe('Material', function() {
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

  it('can create a StandardMaterial with given name and color', function() {
    const name = 'red';
    const color = BABYLON.Color3.Red();
    expect(Material.createColor(name, color, this.scene)).toEqual(jasmine.any(BABYLON.StandardMaterial));
  });

  describe('created by createColor()', function() {
    beforeEach(function() {
      this.name = 'red';
      this.color = BABYLON.Color3.Red();

      this.material = Material.createColor(this.name, this.color, this.scene);
    });

    it('has the given name as property', function() {
      expect(this.material.name).toEqual(this.name);
    });

    it('has the given color set as diffuseColor', function() {
      expect(this.material.diffuseColor).toEqual(this.color);
    });

    it('has backFaceCulling set to false', function() {
      expect(this.material.backFaceCulling).toBeFalsy();
    });
  });
});
