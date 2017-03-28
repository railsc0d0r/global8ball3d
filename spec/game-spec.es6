import Event from '../src/models/event';
import Game from '../src/game';
import ObjectBuilder from '../src/libs/object_builder';
import SurfaceMaterialsCreator from '../src/libs/surface_materials_creator';
import ShadowGenerator from '../src/models/shadow_generator';
import TableCreator from '../src/libs/table_creator';

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

    it('initializes an hash to hold the events', function() {
      expect(this.game.events).toEqual({});
    });

    describe('handling events', function() {
      beforeEach(function() {
        this.eventName = 'myEvent';
        this.game.registerEvent(this.eventName);
      });

      it('can register an event with given name', function() {
        expect(this.game.events[this.eventName]).toEqual(jasmine.any(Event));
      });

      it('can add an event-listener to a registered event', function() {
        const callback = () => {};
        this.game.addEventListener(this.eventName, callback);
        expect(this.game.events[this.eventName].callbacks).toContain(callback);
      });

      it('can dispatch a registered event with arguments', function() {
        const callback = jasmine.createSpy('eventCallback');
        const eventArguments = "i was called";
        this.game.addEventListener(this.eventName, callback);
        this.game.dispatch(this.eventName, eventArguments);

        expect(callback.calls.count()).toEqual(1);
        expect(callback).toHaveBeenCalledWith(eventArguments);
      });
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
        beforeEach(function() {
          let tableCreatorSpy = jasmine.createSpyObj('TableCreator', [
            'createCsgHoles',
            'createPlayground',
            'createBorders',
            'createRail'
          ]);

          tableCreatorSpy.createPlayground.and.returnValue({name: 'playground'});
          tableCreatorSpy.createBorders.and.returnValue([]);
          tableCreatorSpy.createRail.and.returnValue({name: 'rail'});

          this.game.tableCreator = tableCreatorSpy;

          this.game.createTable();
        });

        it('with holes', function() {
          expect(this.game.tableCreator.createCsgHoles).toHaveBeenCalledWith(TableConfig.holesConfig);
        });

        it('with a playground stored as a property', function() {
          expect(this.game.tableCreator.createPlayground).toHaveBeenCalledWith(TableConfig.playgroundConfig, this.game.surfaceMaterials.lightBlue);
          expect(this.game.table.playground).toBeDefined();
          expect(this.game.table.playground.name).toEqual('playground');
        });

        it('with an array of borders stored as a property', function() {
          expect(this.game.tableCreator.createBorders).toHaveBeenCalledWith(TableConfig.bordersConfig, this.game.surfaceMaterials.blue);
          expect(this.game.table.borders).toEqual(jasmine.any(Array));
        });

        it('with a rail stored as a property', function() {
          expect(this.game.tableCreator.createRail).toHaveBeenCalledWith(TableConfig.railConfig, this.game.surfaceMaterials.brown);
          expect(this.game.table.rail).toBeDefined();
          expect(this.game.table.rail.name).toEqual('rail');
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

    describe('on setTableConfig()', function() {
      it('requires an array of configurations for borders', function() {
        const bordersConfigs = NonValues;

        bordersConfigs.forEach( bordersConfig => {
          this.config.bordersConfig = bordersConfig;
          const throwsAnException = () => { this.game.setTableConfig(this.config) };
          expect(throwsAnException).toThrow('Game requires an array of border-definitions to describe the table.');
        });
      });

      it('requires a hash of configuration-options for the rail', function() {
        this.config.railConfig = void 0;
        const throwsAnException = () => { this.game.setTableConfig(this.config) };
        expect(throwsAnException).toThrow('Game requires a hash of config-options for the rail to describe the table.');
      });

      it('requires an array of configurations for the rail-boxes', function() {
        const boxDefinitions = NonValues;

        boxDefinitions.forEach((nonBoxDefinition) => {
          this.config.railConfig.boxes = nonBoxDefinition;
          const throwsAnException = () => { this.game.setTableConfig(this.config) };
          expect(throwsAnException).toThrow('Game requires an array of box-definitions to describe the rail for the table.');
        });
      });

      it('requires a hash of configuration-options for the playground', function() {
        this.config.playgroundConfig = void 0;
        const throwsAnException = () => { this.game.setTableConfig(this.config) };
        expect(throwsAnException).toThrow('Game requires a hash of config-options for the playground to describe the table.');
      });

      it('requires an array of configurations for holes', function() {
        const holesConfigs = NonValues;

        holesConfigs.forEach((holesConfig) => {
          this.config.holesConfig = holesConfig;
          const throwsAnException = () => { this.game.setTableConfig(this.config) };
          expect(throwsAnException).toThrow('Game requires an array of hole-definitions to describe the table.');
        });
      });
    });
  });
});
