import ObjectBuilder from '../../src/object_builder';
import Scene from '../../src/scene';
import SurfaceMaterialsCreator from '../../src/creators/surface_materials_creator';
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

    it('requires a material to create a playground', function() {
      fail('pending');
    });

    it('requires an array of CSG-holes to create a playground', function() {
      fail('pending');
    });

    describe('with given material and CSG-holes', function() {
      beforeEach(function() {
        this.csgHoles = this.tableCreator.createCsgHoles(this.holesConfig);
      });

      it('can create a playground', function() {
        const playground = this.tableCreator.createPlayground(this.csgHoles);

        expect(playground instanceof BABYLON.Mesh).toBeTruthy();

        const dimensions = playground.getBoundingInfo().boundingBox.extendSize.scale(2);
        const expectedWidth = 2.6564;
        const expectedHeight = 0.02;
        const expectedDepth = 1.3864;

        expect(playground.position.x).toEqual(0);
        expect(playground.position.y).toEqual(-(expectedHeight / 2));
        expect(playground.position.z).toEqual(0);

        expect(dimensions.x).toEqual(expectedWidth);
        expect(dimensions.y).toEqual(expectedHeight);
        expect(dimensions.z).toEqual(expectedDepth);

        expect(playground.name).toEqual('playground');
      });
    });
  });
});
