import Scene from '../src/scene';
import HtmlFixtures from './support/html_fixtures';

describe('Scene.create(engine)', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(this.engine);
  });

  afterEach(function() {
    HtmlFixtures.removeFixture();
  });

  it('creates an instance of BABYLON.Scene', function() {
    expect(this.scene).toBeDefined();
    expect(this.scene).toEqual(jasmine.any(BABYLON.Scene));
  });

  it('enables physics', function() {
    expect(this.scene.isPhysicsEnabled()).toBeTruthy();
  });

  it('uses CannonJs as PhysicsEngine', function() {
    expect(this.scene.getPhysicsEngine().getPhysicsPluginName()).toEqual('CannonJSPlugin');
  });

  it('sets gravity to 9,807m/s^2', function() {
    expect(this.scene.getPhysicsEngine().gravity.length()).toEqual(9.807);
  });

  it('shows the debugLayer', function() {
    expect(this.scene.debugLayer.isVisible()).toBeTruthy();
  });
});
