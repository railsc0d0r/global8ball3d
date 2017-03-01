import ObjectBuilder from '../../src/object_builder';
import Scene from '../../src/scene';
import TableCreator from '../../src/creators/table_creator';
import HtmlFixtures from '../support/html_fixtures';

describe('TableCreator', function() {
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
    const throwsAnException = () => new TableCreator;

    expect(throwsAnException).toThrow("TableCreator requires an instance of ObjectBuilder to be created.");
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.objectBuilder = new ObjectBuilder(this.scene);
      this.tableCreator = new TableCreator(this.objectBuilder);
    });

    it('stores given instance of ObjectBuilder as property', function() {
      expect(this.tableCreator.objectBuilder).toEqual(this.objectBuilder);
    });
  });
});
