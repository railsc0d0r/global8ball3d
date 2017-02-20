const Game = class{
  constructor(ballsConfig, bordersConfig) {
    if (typeof(ballsConfig) === 'undefined' || !(ballsConfig instanceof Array)) {
      throw "Game requires an array of ball-definitions to be created.";
    }

    if (typeof(bordersConfig) === 'undefined' || !(bordersConfig instanceof Array)) {
      throw "Game requires an array of border-definitions to be created.";
    }
  }
};

export default Game;
