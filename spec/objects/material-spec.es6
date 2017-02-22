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
    HtmlFixtures.removeFixture();
  });

  it('can create a StandardMaterial with given name and color', function() {
    const name = 'red';
    const color = BABYLON.Color3.Red();
    expect(Material.createColor(name, color, this.scene)).toEqual(jasmine.any(BABYLON.StandardMaterial));
  });

});
