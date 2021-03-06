import Cue from '../../src/models/cue';
import CueConfig from '../../src/config/cue_config';
import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';

import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';
import NumberRound from '../support/number_round';


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

    const surfaceMaterials = new SurfaceMaterialsCreator(this.scene).surfaceMaterials;
    this.materials = [
      surfaceMaterials.black,
      surfaceMaterials.white,
      surfaceMaterials.lightBrown
    ];

    const light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);
    this.shadowGenerator = new ShadowGenerator(light);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  describe('on creation requires given', function() {
    it('target to be a BABYLON.Mesh', function() {
      const nonTargets = NonValues;

      nonTargets.forEach(nonTarget => {
        const throwsAnException = () => { new Cue(nonTarget) };
        expect(throwsAnException).toThrow("Cue requires an instance of BABYLON.Mesh as target to be created.");
      });
    });

    it('shadowGenerator to be valid', function() {
      const nonShadowGenerators = NonValues;

      nonShadowGenerators.forEach(nonShadowGenerator => {
        const throwsAnException = () => { new Cue(this.target, nonShadowGenerator) };
        expect(throwsAnException).toThrow("Cue requires an instance of ShadowGenerator to be created.");
      });
    });

    describe('materials to', function() {
      it('be an array', function() {
        const nonArrays = NonValues;

        nonArrays.forEach(nonArray => {
          const throwsAnException = () => { new Cue(this.target, this.shadowGenerator, nonArray) };
          expect(throwsAnException).toThrow("Cue requires an array of materials to be created.");
        });
      });

      it('contain only materials', function() {
        const nonValidArrays = [
          [],
          [{}]
        ];

        nonValidArrays.forEach(nonValidArray => {
          const throwsAnException = () => { new Cue(this.target, this.shadowGenerator, nonValidArray) };
          expect(throwsAnException).toThrow("Given array must contain only materials and not be empty.");
        });
      });
    });

    it('scene to be a BABYLON.Scene', function() {
      const nonScenes = NonValues;

      nonScenes.forEach(nonScene => {
        const throwsAnException = () => { new Cue(this.target, this.shadowGenerator, this.materials, nonScene) };
        expect(throwsAnException).toThrow("Cue requires an instance of BABYLON.Scene to be created.");
      });
    });
  });

  describe('as instance', function() {
    beforeEach(function() {
      this.cue = new Cue(this.target, this.shadowGenerator, this.materials, this.scene);
      this.expectedUpperBetaLimit = Math.PI / 2 - Math.PI / 64;
      this.expectedLowerBetaLimit = 0;
    });

    it('can be created', function() {
      expect(this.cue).toEqual(jasmine.any(Cue));
    });

    it('sets the upper limit for vertical rotation', function() {
      expect(this.cue.upperBetaLimit).toEqual(this.expectedUpperBetaLimit);
    });

    it('sets the lower limit for vertical rotation', function() {
      expect(this.cue.lowerBetaLimit).toEqual(this.expectedLowerBetaLimit);
    });

    it('sets the precision used for rotation', function() {
      expect(this.cue.rotationalPrecision).toEqual(2 * Math.PI / 72);
    });

    describe('provides a method to check the value given for vertical rotation against defined limits', function() {
      it('returning the lower limit if value is less than it', function() {
        expect(this.cue.checkBetaLimits(-1)).toEqual(this.expectedLowerBetaLimit);
      })

      it('returning the upper limit if value is greater than it', function() {
        expect(this.cue.checkBetaLimits(Math.PI / 2)).toEqual(this.expectedUpperBetaLimit);
      })
    });

    describe('provides a method to normalize the value given for horizontal rotation returning', function() {
      it('the value if it is less or equal than full circle', function() {
        const value = Math.PI;
        const expectedResult = Math.PI;

        expect(this.cue.normalizeAlpha(value)).toEqual(expectedResult);
      });

      it('the normalized value if it is greater than full circle', function() {
        const value = 3 * Math.PI;
        const expectedResult = Math.PI;

        expect(this.cue.normalizeAlpha(value)).toEqual(expectedResult);
      });

      it('the normalized positive value if it is negative and less or equal than full circle', function() {
        const value = -(Math.PI / 2);
        const expectedResult = Math.PI * 1.5;

        expect(this.cue.normalizeAlpha(value)).toEqual(expectedResult);
      });

      it('the normalized positive value if it is negative and greater than full circle', function() {
        const value = -(Math.PI / 2 + 4 * Math.PI);
        const expectedResult = Math.PI * 1.5;

        expect(this.cue.normalizeAlpha(value)).toEqual(expectedResult);
      });
    });

    describe('provides an angle as property describing', function() {
      describe('its horizontal rotation', function() {
        it('returning its value in radians', function() {
          expect(this.cue.alpha).toEqual(0);
        });

        describe('on setting its value', function() {
          beforeEach(function() {
            this.expectedValue = Math.PI;
            this.cue.alpha = this.expectedValue;
          });

          it('storing it', function() {
            expect(this.cue.alpha).toEqual(this.expectedValue);
          });

          it('rotating the cue to the given value horizontally', function() {
            const expectedY = Math.sin(this.expectedValue / 2);
            const expectedW = Math.cos(this.expectedValue / 2);

            expect(this.cue.mesh.rotationQuaternion.y).toEqual(expectedY);
            expect(this.cue.mesh.rotationQuaternion.w).toEqual(expectedW);
          });
        });
      });

      describe('its vertical rotation', function() {
        it('returning its value in radians', function() {
          expect(this.cue.beta).toEqual(0);
        });

        describe('on setting its value', function() {
          beforeEach(function() {
            this.expectedValue = Math.PI / 8 * 3;
            this.cue.beta = this.expectedValue;
          });

          it('storing it', function() {
            expect(this.cue.beta).toEqual(this.expectedValue);
          });

          it('rotating the cue to the given value vertically', function() {
            const expectedZ = Math.sin(this.expectedValue / 2);
            const expectedW = Math.cos(this.expectedValue / 2);

            expect(this.cue.mesh.rotationQuaternion.z).toEqual(expectedZ);
            expect(this.cue.mesh.rotationQuaternion.w).toEqual(expectedW);
          });
        });
      });
    });

    describe('provides a method to rotate the cue one step', function() {
      describe('vertically', function() {
        beforeEach(function() {
          this.beta = Math.PI / 8;
          this.cue.beta = this.beta;
        });

        it('down', function() {
          this.cue.rotateDown();

          const expectedBeta = this.beta + this.cue.rotationalPrecision;

          const expectedZ = Math.sin(expectedBeta / 2);
          const expectedW = Math.cos(expectedBeta / 2);

          expect(NumberRound(this.cue.mesh.rotationQuaternion.z, 14)).toEqual(NumberRound(expectedZ, 14));
          expect(NumberRound(this.cue.mesh.rotationQuaternion.w, 14)).toEqual(NumberRound(expectedW, 14));
        });

        it('up', function() {
          this.cue.rotateUp();

          const expectedBeta = this.beta - this.cue.rotationalPrecision;

          const expectedZ = Math.sin(expectedBeta / 2);
          const expectedW = Math.cos(expectedBeta / 2);

          expect(NumberRound(this.cue.mesh.rotationQuaternion.z, 14)).toEqual(NumberRound(expectedZ, 14));
          expect(NumberRound(this.cue.mesh.rotationQuaternion.w, 14)).toEqual(NumberRound(expectedW, 14));
        });
      })

      describe('horizontally', function() {
        beforeEach(function() {
          this.alpha = Math.PI;
          this.cue.alpha = this.alpha;
        });

        it('left', function() {
          this.cue.rotateLeft();

          const expectedAlpha = this.alpha + this.cue.rotationalPrecision;

          const expectedY = Math.sin(expectedAlpha / 2);
          const expectedW = Math.cos(expectedAlpha / 2);

          expect(NumberRound(this.cue.mesh.rotationQuaternion.y, 14)).toEqual(NumberRound(expectedY, 14));
          expect(NumberRound(this.cue.mesh.rotationQuaternion.w, 14)).toEqual(NumberRound(expectedW, 14));
        });

        it('right', function() {
          this.cue.rotateRight();

          const expectedAlpha = this.alpha - this.cue.rotationalPrecision;

          const expectedY = Math.sin(expectedAlpha / 2);
          const expectedW = Math.cos(expectedAlpha / 2);

          expect(NumberRound(this.cue.mesh.rotationQuaternion.y, 14)).toEqual(NumberRound(expectedY, 14));
          expect(NumberRound(this.cue.mesh.rotationQuaternion.w, 14)).toEqual(NumberRound(expectedW, 14));
        });
      });
    });

    describe('provides a mesh', function() {
      it('as property', function() {
        expect(this.cue.mesh).toEqual(jasmine.any(BABYLON.Mesh));
        expect(this.cue.mesh.name).toEqual('cue');
      });

      it('consisting of subMeshes as described by CueConfig', function() {
        CueConfig.forEach(configPart => {
          const name = configPart.name;

          const cuePartMaterial = this.materials.find(material => {
            return material.name == configPart.color;
          });

          const subMesh = this.cue.mesh.getChildren().find(child => {
            return child.name == name;
          });

          expect(subMesh).toEqual(jasmine.any(BABYLON.Mesh));
          expect(subMesh.material).toEqual(cuePartMaterial);
        });
      });

      it('showing an axis', function() {
        const axis = this.cue.mesh.getChildren().find(child => {
          return child.name == 'cueAxis';
        });

        expect(axis).toEqual(jasmine.any(BABYLON.Mesh));
        expect(axis.color).toEqual(BABYLON.Color3.Red());
      });

      it('dropping shadows', function() {
        this.cue.mesh.getChildren().forEach(subMesh => {
          expect(this.shadowGenerator.renderList).toContain(subMesh);
        });
      });

      it('positioned 8cm from the target', function() {
        const distance = this.cue.mesh.position.subtract(this.target.position);
        expect(distance.length()).toEqual(0.08);
      });

      it('pivoting around the target', function() {
        const pivotAt = this.target.position;
        const cuePosition = this.cue.mesh.position;
        const radiusV3 = cuePosition.subtract(pivotAt);

        const expectedMatrix = BABYLON.Matrix.FromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        expectedMatrix.setTranslation(radiusV3.negate());

        expect(this.cue.mesh.getPivotMatrix()).toEqual(expectedMatrix);
      });
    });
  });
});
