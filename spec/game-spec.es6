import Game from '../src/game';
import SurfaceMaterialsCreator from '../src/creators/surface_materials_creator';
import HtmlFixtures from './support/html_fixtures';

describe('Game', function() {
  beforeEach(function() {
    this.ballsConfig = [];
    this.bordersConfig = [];
    this.holesConfig = [];
    this.railConfig = [];

    this.config = {
      ballsConfig: this.ballsConfig,
      bordersConfig: this.bordersConfig,
      holesConfig: this.holesConfig,
      railConfig: this.railConfig
    };
  });

  it('requires an array of configurations for balls on creation', function() {
    const ballsConfigs = [
      void 0,
      {}
    ];

    ballsConfigs.forEach( ballsConfig => {
      this.config.ballsConfig = ballsConfig;
      const throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of ball-definitions to be created.');
    });
  });

  it('requires an array of configurations for borders on creation', function() {
    const bordersConfigs = [
      void 0,
      {}
    ];

    bordersConfigs.forEach( bordersConfig => {
      this.config.bordersConfig = bordersConfig;
      let throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of border-definitions to be created.');
    });
  });

  it('requires an array of configurations for holes on creation', function() {
    const holesConfigs = [
      void 0,
      {}
    ];

    holesConfigs.forEach((holesConfig) => {
      this.config.holesConfig = holesConfig;
      let throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of hole-definitions to be created.');
    });
  });

  it('requires an array of configurations for the rail on creation', function() {
    const railConfigs = [
      void 0,
      {}
    ];

    railConfigs.forEach((railConfig) => {
      this.config.railConfig = railConfig;
      let throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of rail-definitions to be created.');
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.game = new Game(this.config);
    });

    it('stores given balls-config and provides a getter for it.', function() {
      expect(this.game.ballsConfig).toEqual(this.ballsConfig);
    });

    it('stores given borders-config and provides a getter for it.', function() {
      expect(this.game.bordersConfig).toEqual(this.bordersConfig);
    });

    it('stores given holes-config and provides a getter for it.', function() {
      expect(this.game.holesConfig).toEqual(this.holesConfig);
    });

    it('stores given rail-config and provides a getter for it.', function() {
      expect(this.game.railConfig).toEqual(this.railConfig);
    });

    describe('on init()', function() {
      beforeEach(function() {
        HtmlFixtures.addCanvas();
        this.game.init();
      });

      afterEach(function() {
        HtmlFixtures.removeFixture();
      });

      it('gets the canvas to paint on from DOM and stores it as property', function() {
        let expectedCanvas = document.getElementById('renderCanvas');

        expect(this.game.canvas).toEqual(expectedCanvas);
      });

      it('creates an engine and stores it as property', function() {
        expect(this.game.engine).toEqual(jasmine.any(BABYLON.Engine));
      });

      it('creates a scene and stores it as property', function() {
        expect(this.game.scene).toEqual(jasmine.any(BABYLON.Scene));
      });

      it('creates a light and stores it as property', function() {
        expect(this.game.light).toEqual(jasmine.any(BABYLON.SpotLight));
      });

      it('creates all surfaceMaterials and stores them in a property', function() {
        const expectedSurfaceMaterials = new SurfaceMaterialsCreator(this.game.scene).surfaceMaterials;
        const expectedColors = [
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

        expectedColors.forEach(color => {
          expect(this.game.surfaceMaterials[color]).toEqual(jasmine.any(BABYLON.StandardMaterial));
          expect(this.game.surfaceMaterials[color].name).toEqual(color);
        });
      });
    });
  });
});
