const ShadowGenerator = class {
  constructor(light) {
    if (typeof(light) === 'undefined' || !(light instanceof BABYLON.Light)) {
      throw "A light is required to create a ShadowGenerator.";
    }

    this.generator = new BABYLON.ShadowGenerator(1024, light);
    this.generator.bias = 0.0001;
    this.generator.setDarkness(0.18);
  }

  renderShadowsFrom(objectWithShadow) {
    this.generator.getShadowMap().renderList.push(objectWithShadow);
  }

  get renderList() {
    return this.generator.getShadowMap().renderList;
  }
};

export default ShadowGenerator;
