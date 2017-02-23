import Scene from './scene';

const Game = class {
  constructor(config) {
    if (typeof(config.ballsConfig) === 'undefined' || !(config.ballsConfig instanceof Array)) {
      throw "Game requires an array of ball-definitions to be created.";
    }

    if (typeof(config.bordersConfig) === 'undefined' || !(config.bordersConfig instanceof Array)) {
      throw "Game requires an array of border-definitions to be created.";
    }

    if (typeof(config.holesConfig) === 'undefined' || !(config.holesConfig instanceof Array)) {
      throw "Game requires an array of hole-definitions to be created.";
    }

    if (typeof(config.railConfig) === 'undefined' || !(config.railConfig instanceof Array)) {
      throw "Game requires an array of rail-definitions to be created.";
    }

    this.ballsConfig = config.ballsConfig;
    this.bordersConfig = config.bordersConfig;
    this.holesConfig = config.holesConfig;
    this.railConfig = config.railConfig;
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

  };

};

export default Game;
