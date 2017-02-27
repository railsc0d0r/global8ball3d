import Game from '../src/game';
import SurfaceMaterialsCreator from '../src/creators/surface_materials_creator';
import ShadowGenerator from '../src/objects/shadow_generator';
import HtmlFixtures from './support/html_fixtures';

describe('Game', function() {
  beforeEach(function() {
    this.ballsStates = [];
    this.bordersConfig = [];
    this.holesConfig = [];
    this.railConfig = [];

    this.config = {
      bordersConfig: this.bordersConfig,
      holesConfig: this.holesConfig,
      railConfig: this.railConfig
    };
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

      it('creates a shadowGenerator and stores it as property', function() {
        expect(this.game.shadowGenerator).toEqual(jasmine.any(ShadowGenerator));
      });

      it('initializes ballsStates and ballsStatesChanged', function() {
        expect(this.game.ballsStates).toEqual([]);
        expect(this.game.ballsStatesChanged).toBeFalsy();
      });
    });

    describe('on setBallsStates()', function() {
      it('requires an array of ballsStates', function() {
        const ballsStatesArray = [
          void 0,
          {}
        ];

        ballsStatesArray.forEach( ballsStates => {
          this.config.ballsStates = ballsStates;
          const throwsAnException = () => { this.game.setBallsStates(ballsStates) };
          expect(throwsAnException).toThrow('setBallsStates() requires an array of ballsStates.');
        });
      });

      it('stores given ballsStates and provides a getter for it.', function() {
        this.game.setBallsStates(this.ballsStates);
        expect(this.game.ballsStates).toEqual(this.ballsStates);
      });

      it('sets a flag to tell the game-instance about states-changes', function() {
        this.game.setBallsStates(this.ballsStates);
        expect(this.game.ballsStatesChanged).toBeTruthy();
      });
    });
  });
});
