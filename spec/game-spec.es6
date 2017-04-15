import Event from '../src/models/event';
import Game from '../src/game';
import ObjectBuilder from '../src/libs/object_builder';
import SurfaceMaterialsCreator from '../src/libs/surface_materials_creator';
import ShadowGenerator from '../src/models/shadow_generator';
import TableCreator from '../src/libs/table_creator';
import BallsManager from '../src/libs/balls_manager';

import HtmlFixtures from './support/html_fixtures';
import NonValues from './support/non_values';

import * as TableConfig from '../game_config/table_config';
import BallsStates from '../game_config/balls_config';

describe('Game', function() {
  beforeEach(function() {
    this.ballsStates = [];
    this.bordersConfig = [];
    this.holesConfig = [];
    this.playgroundConfig = {};
    this.railConfig = {
      boxes: []
    };

    this.tableConfig = {
      bordersConfig: this.bordersConfig,
      holesConfig: this.holesConfig,
      playgroundConfig: this.playgroundConfig,
      railConfig: this.railConfig
    };
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.game = new Game();
    });

    it('throws an exception with given message', function() {
      const message = "myMessage";
      const throwsAnException = () => { this.game.throwException(message) };

      expect(throwsAnException).toThrow(message);
    });

    it('intializes a table as empty object and provides a getter for it.', function() {
      expect(this.game.table).toEqual({});
    });

    it('initializes its balls as an empty array', function() {
      expect(this.game.balls).toEqual([]);
    });

    describe('provides certain events:', function() {
      beforeEach(function() {
        this.expectedEvents = Object.keys(this.game.events);
      });

      it('getConfig', function() {
        expect(this.expectedEvents).toContain('getConfig');
      });

      it('setConfig', function() {
        expect(this.expectedEvents).toContain('setConfig');
      });

      it('getStates', function() {
        expect(this.expectedEvents).toContain('getStates');
      });

      it('setStates', function() {
        expect(this.expectedEvents).toContain('setStates');
      });

      it('sendShot', function() {
        expect(this.expectedEvents).toContain('sendShot');
      });

      it('receiveShot', function() {
        expect(this.expectedEvents).toContain('receiveShot');
      });
    });

    it('initializes ballsStates and ballsStatesChanged', function() {
      expect(this.game.ballsStates).toEqual([]);
      expect(this.game.ballsStatesChanged).toBeFalsy();
    });

    it('initializes tableConfig and tableConfigIsSet', function() {
      expect(this.game.tableConfig).toEqual({});
      expect(this.game.tableConfigIsSet).toBeFalsy();
    });

    describe('adds event-listener for', function() {
      it('setStates', function() {
        pending();
      });

      it('setConfig', function() {
        pending();
      });
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
        expect(this.game.events[this.eventName].callbacks).toContain({function: callback, context: void 0});
      });

      it('can add an event-listener to a registered event, specifying its context', function() {
        const callback = () => {};
        this.game.addEventListener(this.eventName, callback, this);
        expect(this.game.events[this.eventName].callbacks).toContain({function: callback, context: this});
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

      it('creates a ballsManager with the right materials and stores it as a property', function() {
        const expectedMaterials = [
          this.game.surfaceMaterials.red,
          this.game.surfaceMaterials.yellow,
          this.game.surfaceMaterials.white,
          this.game.surfaceMaterials.black
        ];

        expect(this.game.ballsManager).toEqual(jasmine.any(BallsManager));
        expect(this.game.ballsManager.materials).toEqual(expectedMaterials);
      });

      describe('creates a camera', function() {
        it('of type ArcRotateCamera', function() {
          expect(this.game.camera).toEqual(jasmine.any(BABYLON.ArcRotateCamera));
        });

        it('pointing to the middle of the table', function() {
          const expectedTarget = new BABYLON.Vector3(0,0,0);
          expect(this.game.camera.target).toEqual(expectedTarget);
        });

        it('from a specified distance', function() {
          const expectedRadius = 3;
          expect(this.game.camera.radius).toEqual(expectedRadius);
        });

        it('with a specified angle', function() {
          const expectedAlpha = Math.PI;
          const expectedBeta = Math.PI / 8 * 3;

          expect(this.game.camera.alpha).toEqual(expectedAlpha);
          expect(this.game.camera.beta).toEqual(expectedBeta);
        });

        it('with specified limits to its movement', function() {
          const expectedUpperBetaLimit = Math.PI / 2 - Math.PI / 64;
          const expectedLowerRadiusLimit = 0.75;
          const expectedUpperRadiusLimit = 4;

          expect(this.game.camera.upperBetaLimit).toEqual(expectedUpperBetaLimit);
          expect(this.game.camera.lowerRadiusLimit).toEqual(expectedLowerRadiusLimit);
          expect(this.game.camera.upperRadiusLimit).toEqual(expectedUpperRadiusLimit);
        });
      });
    });

    describe('on init() waits for the tableConfig and the ballsStates', function() {
      beforeEach(function() {
        HtmlFixtures.addCanvas();

        this.errorMessage = 'myMessage';
        this.resolvedObject = {};

        this.resolvingPromise = new Promise((resolve, reject) => {
          resolve(this.resolvedObject);
        });
        this.rejectingPromise = new Promise((resolve, reject) => {
          reject(this.errorMessage);
        });

        spyOn(this.game, 'createTable');
        spyOn(this.game, 'manageBalls');
      });

      afterEach(function() {
        this.game.engine.dispose();
        HtmlFixtures.removeFixture();
      });

      it('creating the table if the tableConfig is dispatched', function(done) {
        spyOn(this.game, 'checkTableConfig').and.returnValue(this.resolvingPromise);

        this.game.init();
        done();

        expect(this.game.createTable).toHaveBeenCalledWith(this.resolvedObject);
      });

      it('throwing an error if no tableConfig is dispatched', function() {
        spyOn(this.game, 'checkTableConfig').and.returnValue(this.rejectingPromise);
        pending();
      });

      it('managing the balls if ballsStates are dispatched', function(done) {
        spyOn(this.game, 'checkBallsStates').and.returnValue(this.resolvingPromise);

        this.game.init();
        done();

        expect(this.game.manageBalls).toHaveBeenCalledWith(this.resolvedObject);
      });

      it('throwing an error if no ballsStates are dispatched', function() {
        spyOn(this.game, 'checkBallsStates').and.returnValue(this.rejectingPromise);
        pending();
      });
    });

    describe('after initializing', function() {
      beforeEach(function() {
        HtmlFixtures.addCanvas();
        this.game.init();
      });

      afterEach(function() {
        this.game.engine.dispose();
        HtmlFixtures.removeFixture();
      });

      describe('creates a table', function() {
        beforeEach(function() {
          this.game.createTable(TableConfig);
        });

        it('stored as a property', function() {
          expect(this.game.table.playground).toBeDefined();
          expect(this.game.table.playground.name).toEqual('playground');
          expect(this.game.table.playground).toEqual(jasmine.any(BABYLON.Mesh));

          expect(this.game.table.borders).toEqual(jasmine.any(Array));
          this.game.table.borders.forEach(border => {
            expect(border).toEqual(jasmine.any(BABYLON.Mesh));
          });

          expect(this.game.table.rail).toBeDefined();
          expect(this.game.table.rail.name).toEqual('rail');
          expect(this.game.table.rail).toEqual(jasmine.any(BABYLON.Mesh));
        });
      });

      describe('manages the balls', function() {
        beforeEach(function() {
          this.game.manageBalls(BallsStates);
        });

        it('creating the balls given by states', function() {
          expect(this.game.balls.length).toEqual(16);
          this.game.balls.forEach(ball => {
            expect(ball).toEqual(jasmine.any(BABYLON.Mesh));
          });
        });
      });
    });

    describe('on setBallsStates()', function() {
      it('requires an array of ballsStates', function() {
        const ballsStatesArray = NonValues;

        ballsStatesArray.forEach( ballsStates => {
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

    it('sets the ballsStates with given arguments if "setStates" is dipatched', function() {
      this.game.dispatch('setStates', BallsStates);

      expect(this.game.ballsStates).toEqual(BallsStates);
      expect(this.game.ballsStatesChanged).toBeTruthy();
    });

    describe('on setTableConfig()', function() {
      it('requires an array of configurations for borders', function() {
        const bordersConfigs = NonValues;

        bordersConfigs.forEach( bordersConfig => {
          this.tableConfig.bordersConfig = bordersConfig;
          const throwsAnException = () => { this.game.setTableConfig(this.tableConfig) };
          expect(throwsAnException).toThrow('Game requires an array of border-definitions to describe the table.');
        });
      });

      it('requires a hash of configuration-options for the rail', function() {
        this.tableConfig.railConfig = void 0;
        const throwsAnException = () => { this.game.setTableConfig(this.tableConfig) };
        expect(throwsAnException).toThrow('Game requires a hash of config-options for the rail to describe the table.');
      });

      it('requires an array of configurations for the rail-boxes', function() {
        const boxDefinitions = NonValues;

        boxDefinitions.forEach((nonBoxDefinition) => {
          this.tableConfig.railConfig.boxes = nonBoxDefinition;
          const throwsAnException = () => { this.game.setTableConfig(this.tableConfig) };
          expect(throwsAnException).toThrow('Game requires an array of box-definitions to describe the rail for the table.');
        });
      });

      it('requires a hash of configuration-options for the playground', function() {
        this.tableConfig.playgroundConfig = void 0;
        const throwsAnException = () => { this.game.setTableConfig(this.tableConfig) };
        expect(throwsAnException).toThrow('Game requires a hash of config-options for the playground to describe the table.');
      });

      it('requires an array of configurations for holes', function() {
        const holesConfigs = NonValues;

        holesConfigs.forEach((holesConfig) => {
          this.tableConfig.holesConfig = holesConfig;
          const throwsAnException = () => { this.game.setTableConfig(this.tableConfig) };
          expect(throwsAnException).toThrow('Game requires an array of hole-definitions to describe the table.');
        });
      });

      describe('with a valid config', function() {
        beforeEach(function() {
          this.game.setTableConfig(TableConfig);
        });

        it('stores given tableConfig and provides a getter to config-options.', function() {
          expect(this.game.tableConfig).toEqual(TableConfig);
        });

        it('sets a flag to tell the game-instance about config-changes', function() {
          expect(this.game.tableConfigIsSet).toBeTruthy();
        });
      });
    });

    it('sets the tableConfig with given arguments if "setConfig" is dipatched', function() {
      this.game.dispatch('setConfig', TableConfig);

      expect(this.game.tableConfig).toEqual(TableConfig);
      expect(this.game.tableConfigIsSet).toBeTruthy();
    });

    describe('checks if tableConfig is set', function() {
      beforeEach(function() {
        this.promise = this.game.checkTableConfig();
        jasmine.clock().install();
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it('returning a promise', function() {
        expect(this.promise).toEqual(jasmine.any(Promise));
      });

      it('resolving with the config-object if tableConfig is set in time', function(done) {
        this.game.dispatch('setConfig', TableConfig);
        this.promise.then(config => {
          expect(config).toEqual(TableConfig);
          done();
        });
      });

      it('rejecting with a message if tableConfig isn\'t set in 5s', function(done) {
        this.promise.catch(message => {
          expect(message).toEqual("TableConfig wasn't set in 5000ms.");
          done();
        });
        jasmine.clock().tick(6000);
      });
    });

    describe('checks if ballsStates are changed', function() {
      beforeEach(function() {
        this.promise = this.game.checkBallsStates();
        jasmine.clock().install();
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it('returning a promise', function() {
        expect(this.promise).toEqual(jasmine.any(Promise));
      });

      it('resolving with the states if ballsStates are set in time', function(done) {
        this.game.dispatch('setStates', BallsStates);
        this.promise.then(states => {
          expect(states).toEqual(BallsStates);
          done();
        });
      });

      it('setting flag to indicate ballsStatesChanged to false if resolving', function(done) {
        this.game.dispatch('setStates', BallsStates);
        this.promise.then(states => {
          expect(this.game.ballsStatesChanged).toBeFalsy();
          done();
        });
      });

      it('rejecting with a message if ballsStates haven\'t changed in 5s', function(done) {
        this.promise.catch(message => {
          expect(message).toEqual("BallsStates haven't changed in 5000ms.");
          done();
        });
        jasmine.clock().tick(6000);
      });
    });
  });
});
