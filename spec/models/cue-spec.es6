import Cue from '../../src/models/cue';
import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import ShadowGenerator from '../../src/models/shadow_generator';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';

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
    });

    it('can be created', function() {
      expect(this.cue).toEqual(jasmine.any(Cue));
    });

    describe('stores given', function() {
      it('shadowGenerator', function() {
        expect(this.cue.shadowGenerator).toEqual(this.shadowGenerator);
      });

      it('materials', function() {
        expect(this.cue.materials).toEqual(this.materials);
      });
    });

    describe('provides a mesh', function() {
      it('as property', function() {
        expect(this.cue.mesh).toEqual(jasmine.any(BABYLON.Mesh));
        expect(this.cue.mesh.name).toEqual('cue');
      });

      describe('consisting of subMeshes:', function() {
        it('the tip', function() {
          const tip = this.cue.mesh.getChildren().find(child => {
            return child.name == 'tip';
          });

          expect(tip).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('the ferule', function() {
          const ferule = this.cue.mesh.getChildren().find(child => {
            return child.name == 'ferule';
          });

          expect(ferule).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('the taper', function() {
          const taper = this.cue.mesh.getChildren().find(child => {
            return child.name == 'taper';
          });

          expect(taper).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('the shaft', function() {
          const shaft = this.cue.mesh.getChildren().find(child => {
            return child.name == 'shaft';
          });

          expect(shaft).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('the butt', function() {
          const butt = this.cue.mesh.getChildren().find(child => {
            return child.name == 'butt';
          });

          expect(butt).toEqual(jasmine.any(BABYLON.Mesh));
        });

        it('an axis', function() {
          const axis = this.cue.mesh.getChildren().find(child => {
            return child.name == 'cueAxis';
          });

          expect(axis).toEqual(jasmine.any(BABYLON.Mesh));
        });
      });
    });
  });
});
