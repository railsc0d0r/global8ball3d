const InputManager = class {
  constructor(element) {
    if (!(element instanceof Element)) {
      throw 'InputManager requires a DOM-element to take the input from.';
    }

    if (!element.hasAttribute('touch-action')) {
      throw 'DOM-element given to InputManager is required to have an attribute touch-action defined.';
    }

    this.element = element;
  }
};

export default InputManager;
