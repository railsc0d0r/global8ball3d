const Event = class {
  constructor(name) {
    if (typeof name === 'undefined' || !(typeof name === 'string')) {
      throw 'Event requires a name to be created.';
    }

    this.name = name;
    this.callbacks = [];
  }

  registerCallback(callback, context) {
    this.callbacks.push({function: callback, context: context});
  }
};

export default Event;
