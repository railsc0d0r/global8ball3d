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
      const hole_radius = 0.047625347;
      this.holesConfig = [
        {
          id: "leftTop",
          position: {
            x: -1.2991,
            z: -0.6641
          },
          radius: hole_radius
        }, {
          id: "leftBottom",
          position: {
            x: -1.2991,
            z: 0.6641
          },
          radius: hole_radius
        }
      ];

      this.objectBuilder = new ObjectBuilder(this.scene);
      this.tableCreator = new TableCreator(this.objectBuilder);
    });

    it('stores given instance of ObjectBuilder as property', function() {
      expect(this.tableCreator.objectBuilder).toEqual(this.objectBuilder);
    });

    it('creates all holes as CSG-Objects and returns them as an array', function() {
      const csgHoles = this.tableCreator.createCsgHoles(this.holesConfig);

      expect(csgHoles).toEqual(jasmine.any(Array));
      expect(csgHoles.length).not.toEqual(0);

      csgHoles.forEach(csgHole => {
        expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
      });
    });

    it('takes an config-object describing a hole and returns a CSG-object.', function () {
      const firstHoleConfig = this.holesConfig.find( () => { return true; });
      const csgHole = this.tableCreator.createCsgHole(firstHoleConfig);

      expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
    });
  });
});
