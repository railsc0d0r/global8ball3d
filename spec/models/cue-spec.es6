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

    const ballConfig = {
      id: 1,
      type: "breakball",
      radius: 0.0291,
      position: {
          x: -0.635,
          z: 0
      }
    };

    this.target = ObjectBuilder.createSphere(ballConfig, this.scene);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  describe('to be created requires given', function() {
    it('target to be a BABYLON.Mesh', function() {
      pending();
    });

    it('scene to be a BABYLON.Scene', function() {
      pending();
    });
  });

  it('can be created', function() {
    let cue = new Cue(this.target, this.scene);
    expect(cue).toEqual(jasmine.any(Cue));
  });
});
