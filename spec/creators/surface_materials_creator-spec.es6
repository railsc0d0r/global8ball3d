import Scene from '../../src/scene';
import SurfaceMaterialsCreator from '../../src/creators/surface_materials_creator';
import HtmlFixtures from '../support/html_fixtures';

describe('SurfaceMaterialsCreator', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(engine);
  });

  afterEach(function() {
    HtmlFixtures.removeFixture();
  });

  it('can be created with a given scene', function() {
    expect(new SurfaceMaterialsCreator(this.scene)).toEqual(jasmine.any(SurfaceMaterialsCreator));
  });

  it('throws an error if no scene or not an instance of BABYLON.Scene is given when created', function() {
    const scenes = [
      void 0,
      {}
    ];

    scenes.forEach(function(scene) {
      let throwsAnException = () => { new SurfaceMaterialsCreator(scene) };
      expect(throwsAnException).toThrow('SurfaceMaterialsCreator requires an instance of BABYLON.Scene.');
    });

  });

  describe('as instance', function() {
    beforeEach(function() {
      this.creator = new SurfaceMaterialsCreator(this.scene);
      this.expectedColors = [
        'red',
        'yellow',
        'white',
        'black',
        'blue',
        'gray',
        'green',
        'brown',
        'lightBrown',
        'lightBlue'
      ];
    });

    it('provides a property to all created materials', function() {
      expect(this.creator.surfaceMaterials).toEqual(jasmine.any(Object));
    });

    it('created a set of specified colors', function() {
      expect(Object.keys(this.creator.surfaceMaterials)).toEqual(this.expectedColors);
    });

    it('provides a material for every color', function() {
      this.expectedColors.forEach(color => {
        expect(this.creator.surfaceMaterials[color]).toEqual(jasmine.any(BABYLON.StandardMaterial));
      });
    });
  });
});
