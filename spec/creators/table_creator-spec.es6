import ObjectBuilder from '../../src/object_builder';
import Scene from '../../src/scene';
import SurfaceMaterialsCreator from '../../src/creators/surface_materials_creator';
import TableCreator from '../../src/creators/table_creator';
import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';
import NumberRound from '../support/number_round';

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

    it('initializes csgHoles as an empty Array', function() {
      expect(this.tableCreator.csgHoles).toEqual([]);
    });

    it('creates all holes as CSG-Objects and stores them as an array', function() {
      this.tableCreator.createCsgHoles(this.holesConfig);

      expect(this.tableCreator.csgHoles).toEqual(jasmine.any(Array));
      expect(this.tableCreator.csgHoles.length).not.toEqual(0);

      this.tableCreator.csgHoles.forEach(csgHole => {
        expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
      });
    });

    it('takes an config-object describing a hole and returns a CSG-object.', function () {
      const firstHoleConfig = this.holesConfig.find( () => { return true; });
      const csgHole = this.tableCreator._createCsgHole(firstHoleConfig);

      expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
    });

    it('requires a material to create a playground', function() {
      const nonMaterialsArray = NonValues;

      nonMaterialsArray.forEach( nonMaterial => {
        const throwsAnException = () => { this.tableCreator.createPlayground(nonMaterial) };
        expect(throwsAnException).toThrow("A material of type BABYLON.StandardMaterial has to be given to create a playground.");
      });
    });

    describe('with given material', function() {
      beforeEach(function() {
        this.tableCreator.createCsgHoles(this.holesConfig);
        this.material = new SurfaceMaterialsCreator(this.scene).surfaceMaterials.blue;
      });

      describe('can create a playground', function() {
        beforeEach(function() {
          this.playground = this.tableCreator.createPlayground(this.material);
        });

        it('with the right dimensions and the right position', function() {
          expect(this.playground instanceof BABYLON.Mesh).toBeTruthy();

          const dimensions = this.playground.getBoundingInfo().boundingBox.extendSize.scale(2);
          const expectedWidth = 2.6564;
          const expectedHeight = 0.02;
          const expectedDepth = 1.3864;

          expect(this.playground.position.x).toEqual(0);
          expect(this.playground.position.y).toEqual(-(expectedHeight / 2));
          expect(this.playground.position.z).toEqual(0);

          expect(NumberRound(dimensions.x, 4)).toEqual(expectedWidth);
          expect(NumberRound(dimensions.y, 4)).toEqual(expectedHeight);
          expect(NumberRound(dimensions.z, 4)).toEqual(expectedDepth);

          expect(this.playground.name).toEqual('playground');
        });

        it('with an physics_impostor', function() {
          expect(this.playground.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
          expect(this.playground.physicsImpostor.getParam("mass")).toEqual(0);
          expect(this.playground.physicsImpostor.getParam("restitution")).toEqual(0.98);
        });

        it('with a mat material', function() {
          expect(this.playground.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
        });
      });
    });
  });
});
