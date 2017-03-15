import ObjectBuilder from '../../src/object_builder';
import Scene from '../../src/scene';
import ShadowGenerator from '../../src/objects/shadow_generator';
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

  it('requires an instance of ShadowGenerator to be created', function() {
    const objectBuilder = new ObjectBuilder(this.scene);
    const nonShadowGenerators = NonValues;

    nonShadowGenerators.forEach(nonShadowGenerator => {
      const throwsAnException = () => { new TableCreator(objectBuilder, nonShadowGenerator) };
      expect(throwsAnException).toThrow("TableCreator requires an instance of ShadowGenerator to be created.");
    });
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
      const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
      this.shadowGenerator = new ShadowGenerator(light);

      this.tableCreator = new TableCreator(this.objectBuilder, this.shadowGenerator);
    });

    it('stores given instance of ObjectBuilder as property', function() {
      expect(this.tableCreator.objectBuilder).toEqual(this.objectBuilder);
    });

    it('stores given instance of ShadowGenerator as property', function() {
      expect(this.tableCreator.shadowGenerator).toEqual(this.shadowGenerator);
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

      it('requires a config-object to create a playground', function() {
        const throwsAnException = () => { this.tableCreator.createPlayground(this.material) };
        expect(throwsAnException).toThrow("A hash of config-options has to be given to create a playground.");
      });

      describe('can create a playground', function() {
        beforeEach(function() {
          let height = 0.02;

          this.playgroundConfig = {
              id: 'playground',
              width: 2.6564,
              height: height,
              depth: 1.3864,
              mass: 0,
              restitution: 0.98,
              position: {
                x: 0,
                y: -(height / 2),
                z: 0
              }
          };

          this.playground = this.tableCreator.createPlayground(this.material, this.playgroundConfig);
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

        it('that receives shadows', function() {
          expect(this.playground.receiveShadows).toBeTruthy();
        });
      });

      describe('can create borders', function() {
        beforeEach(function() {
          const ball_diameter = 0.0291 * 2;
          const nose_height = ball_diameter * 0.65;
          const rail_height = 0.04445;

          this.borderConfigs = [{
            id: "left",
            vertices: [{
              x: -1.27,
              y: nose_height,
              z: -0.560916126
            }, {
              x: -1.3282,
              y: 0,
              z: -0.624416589
            }, {
              x: -1.3282,
              y: rail_height,
              z: -0.624416589
            }, {
              x: -1.27,
              y: nose_height,
              z: 0.560916126
            }, {
              x: -1.3282,
              y: 0,
              z: 0.624416589
            }, {
              x: -1.3282,
              y: rail_height,
              z: 0.624416589
            }]
          }, {
            id: "leftTop",
            vertices: [{
              x: -1.187978569,
              y: nose_height,
              z: 0.635
            }, {
              x: -1.259416589,
              y: 0,
              z: 0.6932
            }, {
              x: -1.259416589,
              y: rail_height,
              z: 0.6932
            }, {
              x: -0.066146316,
              y: nose_height,
              z: 0.635
            }, {
              x: -0.047625347,
              y: 0,
              z: 0.6932
            }, {
              x: -0.047625347,
              y: rail_height,
              z: 0.6932
            }]
          }]

          this.borders = this.tableCreator.createBorders(this.borderConfigs, this.material);
        });

        it('returning an array of meshes', function() {
          expect(this.borders).toEqual(jasmine.any(Array));
          expect(this.borders.length).toEqual(2);

          this.borders.forEach(border => {
            expect(border).toEqual(jasmine.any(BABYLON.Mesh));
          });
        });

        it('with a mat material', function() {
          this.borders.forEach(border => {
            expect(border.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
          });
        });

        it('with certain physics-params', function() {
          this.borders.forEach(border => {
            expect(border.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
            expect(border.physicsImpostor.getParam("mass")).toEqual(0);
            expect(border.physicsImpostor.getParam("restitution")).toEqual(0.8);
          });
        });

        it('that receive shadows', function() {
          this.borders.forEach(border => {
            expect(border.receiveShadows).toBeTruthy();
          });
        });

        it('that generate shadows', function() {
          expect(this.tableCreator.shadowGenerator.generator.getShadowMap().renderList).toEqual(this.borders);
        });
      });

      describe('can create the rail', function() {
        beforeEach(function() {
          this.railConfig = {
            boxes: [
              {
                id: "left",
                width: 0.15,
                height: 0.0889,
                depth: 1.6864,
                position: {
                  x: 1.4032,
                  y: 0,
                  z: 0
                }
              }, {
                id: "right",
                width: 0.15,
                height: 0.0889,
                depth:1.6864,
                position: {
                  x: -1.4032,
                  y: 0,
                  z: 0
                }
              }, {
                id: "top",
                width: 2.9564,
                height: 0.0889,
                depth: 0.15,
                position: {
                  x: 0,
                  y: 0,
                  z: 0.7682
                }
              }, {
                id: "bottom",
                width: 2.9564,
                height: 0.0889,
                depth: 0.15,
                position: {
                  x: 0,
                  y: 0,
                  z:
                  -0.7682
                }
              }
            ],
            mass: 0,
            restitution: 0.98
          };

          this.rail = this.tableCreator.createRail(this.railConfig, this.material);
        });

        it('returning a mesh', function() {
          expect(this.rail).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('with a mat material', function() {
          expect(this.rail.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
        });

        it('with certain physics-params', function() {
          expect(this.rail.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
          expect(this.rail.physicsImpostor.getParam("mass")).toEqual(0);
          expect(this.rail.physicsImpostor.getParam("restitution")).toEqual(0.98);
        });

        it('that receive shadows', function() {
          expect(this.rail.receiveShadows).toBeTruthy();
        });
      });
    });
  });
});
