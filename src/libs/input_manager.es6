const InputManager = class {
  constructor(element) {
    InputManager._validateDomElement(element);

    this._element = element;
  }

  get element() {
    return this._element;
  }

  static _validateDomElement(element) {
    if (!(element instanceof Element)) {
      throw 'InputManager requires a DOM-element to take the input from.';
    }

    if (!element.hasAttribute('touch-action')) {
      throw 'DOM-element given to InputManager is required to have an attribute touch-action defined.';
    }
  }
};

export default InputManager;
