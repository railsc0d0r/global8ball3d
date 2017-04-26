import Cue from '../../src/models/cue';
import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';

import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';


describe('Cue', () => {
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

  it('can be instanciated', () => {
    let cue = new Cue();
    expect(cue).toEqual(jasmine.any(Cue));
  });

  it('validates the given target to be a mesh', function() {
    pending();
  });

  it('validates the given scene', function() {
    pending();
  });
});
