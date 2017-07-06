const InputManager = class {
  constructor(element) {
    if (!(element instanceof Element)) {
      throw 'InputManager requires a DOM-element to take the input from.';
    }
  }
};

export default InputManager;
