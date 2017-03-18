import Game from '../src/game';
import SurfaceMaterialsCreator from '../src/creators/surface_materials_creator';
import ShadowGenerator from '../src/objects/shadow_generator';
import HtmlFixtures from './support/html_fixtures';
import NonValues from './support/non_values';
import * as TableConfig from '../game_config/table_config';

describe('Game', function() {
  beforeEach(function() {
    this.ballsStates = [];
    this.bordersConfig = [];
    this.holesConfig = [];
    this.playgroundConfig = {};
    this.railConfig = {
      boxes: []
    };

    this.config = {
      bordersConfig: this.bordersConfig,
      holesConfig: this.holesConfig,
      playgroundConfig: this.playgroundConfig,
      railConfig: this.railConfig
    };
  });

  it('requires an array of configurations for borders on creation', function() {
    const bordersConfigs = NonValues;

    bordersConfigs.forEach( bordersConfig => {
      this.config.bordersConfig = bordersConfig;
      const throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of border-definitions to be created.');
    });
  });

  it('requires a hash of configuration-options for the rail on creation', function() {
    this.config.railConfig = void 0;
    const throwsAnException = () => { new Game(this.config) };
    expect(throwsAnException).toThrow('Game requires a hash of config-options for the rail to be created.');
  });

  it('requires a hash of configuration-options for the playground on creation', function() {
    this.config.playgroundConfig = void 0;
    const throwsAnException = () => { new Game(this.config) };
    expect(throwsAnException).toThrow('Game requires a hash of config-options for the playground to be created.');
  });

  it('requires an array of configurations for holes on creation', function() {
    const holesConfigs = NonValues;

    holesConfigs.forEach((holesConfig) => {
      this.config.holesConfig = holesConfig;
      const throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of hole-definitions to be created.');
    });
  });

  it('requires an array of configurations for the rail-boxes on creation', function() {
    const boxDefinitions = NonValues;

    boxDefinitions.forEach((nonBoxDefinition) => {
      this.config.railConfig.boxes = nonBoxDefinition;
      const throwsAnException = () => { new Game(this.config) };
      expect(throwsAnException).toThrow('Game requires an array of box-definitions to describe the rail to be created.');
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.game = new Game(TableConfig);
    });

    it('stores given borders-config and provides a getter for it.', function() {
      expect(this.game.bordersConfig).toEqual(TableConfig.bordersConfig);
    });

    it('stores given holes-config and provides a getter for it.', function() {
      expect(this.game.holesConfig).toEqual(TableConfig.holesConfig);
    });

    it('stores given rail-config and provides a getter for it.', function() {
      expect(this.game.railConfig).toEqual(TableConfig.railConfig);
    });

    it('stores given playground-config and provides a getter for it.', function() {
      expect(this.game.playgroundConfig).toEqual(TableConfig.playgroundConfig);
    });

    it('intializes a table as empty object and provides a getter for it.', function() {
      expect(this.game.table).toEqual({});
    });

    describe('on init()', function() {
      beforeEach(function() {
        HtmlFixtures.addCanvas();
        this.game.init();
      });

      afterEach(function() {
        this.game.engine.dispose();
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

      it('creates a objectBuilder and stores it as property', function() {
        expect(this.game.objectBuilder).toEqual(jasmine.any(ObjectBuilder));
      });

      it('creates a tableCreator and stores it as property', function() {
        expect(this.game.tableCreator).toEqual(jasmine.any(TableCreator));
      });

      describe('creates a table', function() {
        it('with a playground', function() {
          expect(this.game.table.playground).toEqual(jasmine.any(BABYLON.Mesh));
          expect(this.game.table.playground.name).toEqual('playground');
        });
      });
    });

    describe('on setBallsStates()', function() {
      it('requires an array of ballsStates', function() {
        const ballsStatesArray = NonValues;

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
