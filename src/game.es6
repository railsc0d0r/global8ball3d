const Game = class {
  constructor(ballsConfig, bordersConfig, holesConfig, railConfig) {
    if (typeof(ballsConfig) === 'undefined' || !(ballsConfig instanceof Array)) {
      throw "Game requires an array of ball-definitions to be created.";
    }

    if (typeof(bordersConfig) === 'undefined' || !(bordersConfig instanceof Array)) {
      throw "Game requires an array of border-definitions to be created.";
    }

    if (typeof(holesConfig) === 'undefined' || !(holesConfig instanceof Array)) {
      throw "Game requires an array of hole-definitions to be created.";
    }

    if (typeof(railConfig) === 'undefined' || !(railConfig instanceof Array)) {
      throw "Game requires an array of rail-definitions to be created.";
    }

    this.ballsConfig = ballsConfig;
    this.bordersConfig = bordersConfig;
    this.holesConfig = holesConfig;
    this.railConfig = railConfig;
  }

};

export default Game;
