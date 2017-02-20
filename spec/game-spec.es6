'use strict';

import Game from '../src/game';

describe('Game', function() {
  beforeEach(function() {
    this.ballsConfig = [];
    this.bordersConfig = [];
  });

  it('requires an array of configurations for balls on creation', function() {
    const ballsConfigs = [
      () => { return; },
      {}
    ];

    ballsConfigs.forEach(function(config) {
      let throwsAnException = () => { new Game(config) };
      expect(throwsAnException).toThrow('Game requires an array of ball-definitions to be created.');
    });
  });

  it('requires an array of configurations for borders on creation', function() {
    const bordersConfigs = [
      () => { return; },
      {}
    ];

    bordersConfigs.forEach(function(config) {
      let throwsAnException = () => { new Game(this.ballsConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of border-definitions to be created.');
    }, this);
  });
});
