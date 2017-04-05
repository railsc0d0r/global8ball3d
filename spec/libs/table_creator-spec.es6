import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';
import TableCreator from '../../src/libs/table_creator';
import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';
import NumberRound from '../support/number_round';
import * as TableConfig from '../../game_config/table_config';

describe('TableCreator', function() {
  describe('validates given object to', function() {
    it('be an instance of BABYLON.Scene', function() {
      const nonScenes = NonValues;
      nonScenes.forEach(nonScene => {
        const throwsAnException = () => TableCreator.validateScene(nonScene);
        expect(throwsAnException).toThrow("Given object is not an instance of BABYLON.Scene.");
      });
    });

    it('be an instance of ShadowGenerator', function() {
      const nonShadowGenerators = NonValues;
      nonShadowGenerators.forEach(nonShadowGenerator => {
        const throwsAnException = () => TableCreator.validateShadowGenerator(nonShadowGenerator);
        expect(throwsAnException).toThrow("Given object is not an instance of ShadowGenerator.");
      });
    });

    it('be a hash of options and contain the expected config-hashes', function() {
      const nonConfigs = NonValues;
      nonConfigs.forEach(nonConfig => {
        const throwsAnException = () => TableCreator.validateConfig(nonConfig);
        expect(throwsAnException).toThrow("Given config is not valid. It has to be a hash of config-options describing the borders, holes, playground and the rail.");
      });
    });

    it('be an instance of BABYLON.StandardMaterial', function() {
      const nonMaterials = NonValues;
      nonMaterials.forEach(nonMaterial => {
        const throwsAnException = () => TableCreator.validateMaterial(nonMaterial);
        expect(throwsAnException).toThrow("Given material is not valid. Expected an object of type BABYLON.StandardMaterial.");
      });
    });
  });

  describe('given a scene', function() {
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

    describe('creates a hole', function() {
      beforeEach(function() {
        this.holeConfig = TableConfig.holesConfig.find( () => { return true; });
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => TableCreator._createCsgHole(this.holeConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not an instance of BABYLON.Scene.");
        });
      });

      it('returning a CSG-object.', function () {
        const csgHole = TableCreator._createCsgHole(this.holeConfig, this.scene);

        expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
      });
    });

    describe('creates all holes', function() {
      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => TableCreator.createCsgHoles(TableConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not an instance of BABYLON.Scene.");
        });
      });

      it('returning an array of CSG-Objects', function() {
        const expectedCsgHoles = TableCreator.createCsgHoles(TableConfig, this.scene);

        expect(expectedCsgHoles).toEqual(jasmine.any(Array));
        expect(expectedCsgHoles.length).not.toEqual(0);

        expectedCsgHoles.forEach(csgHole => {
          expect(csgHole).toEqual(jasmine.any(BABYLON.CSG));
        });
      });
    });

    describe('and a material', function() {
      beforeEach(function() {
        this.material = new SurfaceMaterialsCreator(this.scene).surfaceMaterials.blue;
      });

      describe('creates a playground', function() {
        it('validating the config-object', function() {
          const throwsAnException = () => { TableCreator.createPlayground() };
          expect(throwsAnException).toThrow("Given config is not valid. It has to be a hash of config-options describing the borders, holes, playground and the rail.");
        });

        it('validating the material', function() {
          const nonMaterials = NonValues;
          nonMaterials.forEach(nonMaterial => {
            const throwsAnException = () => TableCreator.createPlayground(TableConfig, nonMaterial);
            expect(throwsAnException).toThrow("Given material is not valid. Expected an object of type BABYLON.StandardMaterial.");
          });
        });

        it('validating the scene', function() {
          const nonScenes = NonValues;
          nonScenes.forEach(nonScene => {
            const throwsAnException = () => TableCreator._createCsgHole(this.holeConfig, nonScene);
            expect(throwsAnException).toThrow("Given object is not an instance of BABYLON.Scene.");
          });
        });

        describe('returning a mesh', function() {
          beforeEach(function() {
            this.playground = TableCreator.createPlayground(TableConfig, this.material, this.scene);
          });

          it('with the right properties, an PhysicsImpostor, a mat material, receiving shadows', function() {
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

            expect(this.playground.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
            expect(this.playground.physicsImpostor.getParam("mass")).toEqual(0);
            expect(this.playground.physicsImpostor.getParam("restitution")).toEqual(0.98);

            expect(this.playground.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));

            expect(this.playground.receiveShadows).toBeTruthy();
          });
        });
      });
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

    describe('with given material', function() {
      beforeEach(function() {
        this.tableCreator.createCsgHoles(this.holesConfig);
        this.material = new SurfaceMaterialsCreator(this.scene).surfaceMaterials.blue;
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

        xit('returning an array of meshes', function() {
          expect(this.borders).toEqual(jasmine.any(Array));
          expect(this.borders.length).toEqual(2);

          this.borders.forEach(border => {
            expect(border).toEqual(jasmine.any(BABYLON.Mesh));
          });
        });

        xit('with a mat material', function() {
          this.borders.forEach(border => {
            expect(border.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
          });
        });

        xit('with certain physics-params', function() {
          this.borders.forEach(border => {
            expect(border.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
            expect(border.physicsImpostor.getParam("mass")).toEqual(0);
            expect(border.physicsImpostor.getParam("restitution")).toEqual(0.8);
          });
        });

        xit('that receive shadows', function() {
          this.borders.forEach(border => {
            expect(border.receiveShadows).toBeTruthy();
          });
        });

        xit('that generate shadows', function() {
          expect(this.tableCreator.shadowGenerator.renderList).toEqual(this.borders);
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

        xit('returning a mesh', function() {
          expect(this.rail).toEqual(jasmine.any(BABYLON.Mesh));
        });

        xit('with a mat material', function() {
          expect(this.rail.material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
        });

        xit('with certain physics-params', function() {
          expect(this.rail.physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
          expect(this.rail.physicsImpostor.getParam("mass")).toEqual(0);
          expect(this.rail.physicsImpostor.getParam("restitution")).toEqual(0.98);
        });

        xit('that receives shadows', function() {
          expect(this.rail.receiveShadows).toBeTruthy();
        });
      });
    });
  });
});
