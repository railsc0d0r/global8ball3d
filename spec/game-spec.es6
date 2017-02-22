import Game from '../src/game';
import HtmlFixtures from './support/html_fixtures';

describe('Game', function() {
  beforeEach(function() {
    this.ballsConfig = [];
    this.bordersConfig = [];
    this.holesConfig = [];
    this.railConfig = [];
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

  it('requires an array of configurations for the rail on creation', function() {
    const railConfigs = [
      void 0,
      {}
    ];

    railConfigs.forEach((config) => {
      let throwsAnException = () => { new Game(this.ballsConfig, this.bordersConfig, this.holesConfig, config) };
      expect(throwsAnException).toThrow('Game requires an array of rail-definitions to be created.');
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.game = new Game(this.ballsConfig, this.bordersConfig, this.holesConfig, this.railConfig);
    });

    it('stores given balls-config and provides a getter for it.', function() {
      expect(this.game.ballsConfig).toEqual(this.ballsConfig);
    });

    it('stores given borders-config and provides a getter for it.', function() {
      expect(this.game.bordersConfig).toEqual(this.bordersConfig);
    });

    it('stores given holes-config and provides a getter for it.', function() {
      expect(this.game.holesConfig).toEqual(this.holesConfig);
    });

    it('stores given rail-config and provides a getter for it.', function() {
      expect(this.game.railConfig).toEqual(this.railConfig);
    });

    describe('on init()', function() {
      beforeEach(function() {
        HtmlFixtures.addCanvas();
        this.game.init();
      });

      afterEach(function() {
        HtmlFixtures.removeFixture();
      });

      it('gets the canvas to paint on from DOM and stores it as property', function() {
        let expectedCanvas = document.getElementById('renderCanvas');

        expect(this.game.canvas).toEqual(expectedCanvas);
      });
    });
  });
});
