import InputManager from '../../src/libs/input_manager';

import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';

fdescribe('InputManager', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    this.canvas = document.getElementById('renderCanvas');
  });

  afterEach(function() {
    HtmlFixtures.removeFixture();
  });

  it('requires an DOM-element to be created', function() {
    const nonDOMElements = NonValues;

    nonDOMElements.forEach(nonElement => {
      const throwsAnException = () => { new InputManager(nonElement); };
      expect(throwsAnException).toThrow('InputManager requires a DOM-element to take the input from.');
    });
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.inputManager = new InputManager(this.canvas);
    });

    it('stores the given DOM-element as a property', function() {
      expect(this.inputManager.element).toEqual(this.canvas);
    });
  });

});
