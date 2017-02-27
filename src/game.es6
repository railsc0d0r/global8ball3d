import Scene from './scene';
import SurfaceMaterialsCreator from './creators/surface_materials_creator';
import ShadowGenerator from './objects/shadow_generator';

const Game = class {
  constructor(config) {
    if (typeof(config.bordersConfig) === 'undefined' || !(config.bordersConfig instanceof Array)) {
      throw "Game requires an array of border-definitions to be created.";
    }

    if (typeof(config.holesConfig) === 'undefined' || !(config.holesConfig instanceof Array)) {
      throw "Game requires an array of hole-definitions to be created.";
    }

    if (typeof(config.railConfig) === 'undefined' || !(config.railConfig instanceof Array)) {
      throw "Game requires an array of rail-definitions to be created.";
    }

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

    // initializes the surfaceMaterials used in the game
    this.surfaceMaterials = new SurfaceMaterialsCreator(this.scene).surfaceMaterials;

    // initializes a new shadowGenerator
    this.shadowGenerator = new ShadowGenerator(this.light);

    // initializes ballsStates
    this.ballsStates = [];

    // initializes ballsStatesChanged
    this.ballsStatesChanged = false;
  }

  setBallsStates(ballsStates) {
    if (typeof(ballsStates) === 'undefined' || !(ballsStates instanceof Array)) {
      throw "setBallsStates() requires an array of ballsStates.";
    }
    this.ballsStates = ballsStates;

    // to be set to false when the changes take effect
    this.ballsStatesChanged = true;
  }

};

export default Game;
