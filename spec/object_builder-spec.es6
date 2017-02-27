import ObjectBuilder from '../src/object_builder';
import Scene from '../src/scene';
import HtmlFixtures from './support/html_fixtures';

describe('ObjectBuilder', function() {
  beforeEach(function() {
    HtmlFixtures.addCanvas();
    const canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = Scene.create(this.engine);
  });

  afterEach(function() {
    this.engine.dispose();
    HtmlFixtures.removeFixture();
  });

  it('requires a scene to be created', function() {
    const throwsAnException = () => { new ObjectBuilder };

    expect(throwsAnException).toThrow('ObjectBuilder requires a scene to be created.');
  });

  describe('as an instance', function() {
    beforeEach(function() {
      this.objectBuilder = new ObjectBuilder(this.scene);
    });

    it('takes a scene and stores it as a property', function() {
      expect(this.objectBuilder.scene).toEqual(this.scene);
    })

    it('can create a box from given config', function() {
      const height = 0.02;

      const boxConfig = {
        name: 'test',
        width: 2.6564,
        height: height,
        depth: 1.3864,
        position: {
          x: 0,
          y: -(height / 2),
          z: 0
        }
      };
      const box = this.objectBuilder.createBox(boxConfig);
      const dimensions = box.getBoundingInfo().boundingBox.extendSize.scale(2);

      expect(box.position.x).toEqual(boxConfig.position.x);
      expect(box.position.y).toEqual(boxConfig.position.y);
      expect(box.position.z).toEqual(boxConfig.position.z);

      expect(dimensions.x).toEqual(boxConfig.width);
      expect(dimensions.y).toEqual(boxConfig.height);
      expect(dimensions.z).toEqual(boxConfig.depth);

      expect(box.name).toEqual(boxConfig.name);
    });
  });
});
