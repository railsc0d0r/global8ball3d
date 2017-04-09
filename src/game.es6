import Event from './models/event';
import ObjectBuilder from './libs/object_builder';
import Scene from './models/scene';
import SurfaceMaterialsCreator from './libs/surface_materials_creator';
import ShadowGenerator from './models/shadow_generator';
import TableCreator from './libs/table_creator';

const Game = class {
  constructor() {
    // creates an object to hold the events registered on the game
    this.events = {};

    // registers events
    const eventNames = [
      'getConfig',
      'setConfig',
      'getStates',
      'setStates',
      'sendShot',
      'receiveShot'
    ];

    eventNames.forEach(eventName => {
      this.registerEvent(eventName);
    });

    // creates an empty object as placeholder for the table
    this.table = {};

    // initializes tableConfig
    this.tableConfig = {};

    // initializes tableConfigIsSet
    this.tableConfigIsSet = false;

    // initializes ballsStates
    this.ballsStates = [];

    // initializes ballsStatesChanged
    this.ballsStatesChanged = false;

    // adds event-listeners
    this.addEventListener('setStates', this.setBallsStates);
    this.addEventListener('setConfig', this.setTableConfig);
  }

  init() {
    // the canvas element to render on
    this.canvas = document.getElementById('renderCanvas');

    // the engine used to render the world
    this.engine = new BABYLON.Engine(this.canvas, true);

    // the scene to be used to render objects
    this.scene = Scene.create(this.engine);

    // create a spot-light 2m above the table, looking straight down
    this.light = new BABYLON.SpotLight('tableLight', new BABYLON.Vector3(0,2,0), new BABYLON.Vector3(0,-1,0), Math.PI / 2, 2.5, this.scene);

    // initializes the surfaceMaterials used in the game
    this.surfaceMaterials = new SurfaceMaterialsCreator(this.scene).surfaceMaterials;

    // initializes a new shadowGenerator
    this.shadowGenerator = new ShadowGenerator(this.light);
  }

  setTableConfig(config) {
    if (typeof(config.bordersConfig) === 'undefined' || !(config.bordersConfig instanceof Array)) {
      throw "Game requires an array of border-definitions to describe the table.";
    }

    if (typeof(config.holesConfig) === 'undefined' || !(config.holesConfig instanceof Array)) {
      throw "Game requires an array of hole-definitions to describe the table.";
    }

    if (typeof(config.railConfig) === 'undefined') {
      throw "Game requires a hash of config-options for the rail to describe the table.";
    }

    if (typeof(config.railConfig.boxes) === 'undefined' || !(config.railConfig.boxes instanceof Array)) {
      throw "Game requires an array of box-definitions to describe the rail for the table.";
    }

    if (typeof(config.playgroundConfig) === 'undefined') {
      throw "Game requires a hash of config-options for the playground to describe the table.";
    }

    this.tableConfig = config;

    this.tableConfigIsSet = true;
  }

  checkTableConfig() {
    return new Promise((resolve, reject) => {
      let intervalId = 0;
      let timeoutId = 0;
      const timeOut = 5000;

      intervalId = window.setInterval(() => {
        if (this.tableConfigIsSet) {
          resolve(this.tableConfig);
          Game._clearTimeoutOrInterval(intervalId, timeoutId);
        }
      }, 100);

      timeoutId = window.setTimeout(() => {
        const message = "TableConfig wasn't set in " + timeOut + "ms.";
        reject(message);
        Game._clearTimeoutOrInterval(intervalId, timeoutId);
      }, timeOut);
    });
  }

  createTable(config) {
    this.table.playground = TableCreator.createPlayground(config, this.surfaceMaterials.lightBlue, this.scene);
    this.table.borders = TableCreator.createBorders(config, this.surfaceMaterials.blue, this.shadowGenerator, this.scene);
    this.table.rail = TableCreator.createRail(config, this.surfaceMaterials.brown, this.scene);
  }

  setBallsStates(ballsStates) {
    if (typeof(ballsStates) === 'undefined' || !(ballsStates instanceof Array)) {
      throw "setBallsStates() requires an array of ballsStates.";
    }
    this.ballsStates = ballsStates;

    // to be set to false when the changes take effect
    this.ballsStatesChanged = true;
  }

  checkBallsStatesChanged() {
    return new Promise((resolve, reject) => {
      let intervalId = 0;
      let timeoutId = 0;
      const timeOut = 5000;

      intervalId = window.setInterval(() => {
        if (this.ballsStatesChanged) {
          resolve(true);
          Game._clearTimeoutOrInterval(intervalId, timeoutId);
        }
      }, 100);

      timeoutId = window.setTimeout(() => {
        const message = "BallsStates haven't changed in " + timeOut + "ms.";
        reject(message);
        Game._clearTimeoutOrInterval(intervalId, timeoutId);
      }, timeOut);
    });
  }

  registerEvent(eventName) {
    const event = new Event(eventName);
    this.events[eventName] = event;
  }

  addEventListener(eventName, callback, context) {
    this.events[eventName].registerCallback(callback, context);
  }

  dispatch(eventName, ...eventArgs) {
    this.events[eventName].callbacks.forEach((callback) => {
      let context = (typeof callback.context === 'undefined') ? this : callback.context;
      callback.function.apply(context, eventArgs);
    });
  }

  static _clearTimeoutOrInterval(...ids) {
    ids.forEach(id => {
      window.clearTimeout(id);
    });
  }
};

export default Game;
