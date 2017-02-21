'use strict';

import Game from '../src/game';

describe('Game', function() {
  beforeEach(function() {
    this.ballsConfig = [];
    this.bordersConfig = [];
    this.holesConfig = [];
  });

  it('requires an array of configurations for balls on creation', function() {
    const ballsConfigs = [
      void 0,
      {}
    ];

    ballsConfigs.forEach(function(config) {
      let throwsAnException = () => { new Game(config) };
      expect(throwsAnException).toThrow('Game requires an array of ball-definitions to be created.');
    });
  });

  it('requires an array of configurations for borders on creation', function() {
    const bordersConfigs = [
      void 0,
      {}
    ];

    bordersConfigs.forEach((config) => {
      let throwsAnException = () => { new Game(this.ballsConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of border-definitions to be created.');
    });
  });

  it('requires an array of configurations for holes on creation', function() {
    const holesConfigs = [
      void 0,
      {}
    ];

    holesConfigs.forEach((config) => {
      let throwsAnException = () => { new Game(this.ballsConfig, this.bordersConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of hole-definitions to be created.');
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.game = new Game(this.ballsConfig, this.bordersConfig, this.holesConfig);
    });

    it('stores given balls-config and provides a getter for it.', function() {
      expect(this.game.ballsConfig).toEqual(this.ballsConfig);
    });
  });
});
