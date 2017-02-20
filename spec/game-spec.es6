'use strict';

import Game from '../src/game';

describe('Game', function() {
  beforeEach(function() {
    this.ballsConfig = [];
    this.bordersConfig = [];
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

    bordersConfigs.forEach(function(config) {
      let throwsAnException = () => { new Game(this.ballsConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of border-definitions to be created.');
    }, this);
  });

  it('requires an array of configurations for holes on creation', function() {
    const holesConfigs = [
      void 0,
      {}
    ];

    holesConfigs.forEach(function(config) {
      let throwsAnException = () => { new Game(this.ballsConfig, this.bordersConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of hole-definitions to be created.');
    }, this);
  });
});
