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

      expect(box instanceof BABYLON.Mesh).toBeTruthy();
      expect(box.position.x).toEqual(boxConfig.position.x);
      expect(box.position.y).toEqual(boxConfig.position.y);
      expect(box.position.z).toEqual(boxConfig.position.z);

      expect(dimensions.x).toEqual(boxConfig.width);
      expect(dimensions.y).toEqual(boxConfig.height);
      expect(dimensions.z).toEqual(boxConfig.depth);

      expect(box.name).toEqual(boxConfig.name);
    });

    it('can create a sphere from given config', function() {
      const radius = 0.4;
      const sphereConfig = {
        name: 'test',
        radius: radius,
        position: {
          x: 0,
          y: radius,
          z: 0
        }
      };

      const sphere = this.objectBuilder.createSphere(sphereConfig);
      const realRadius = sphere.getBoundingInfo().boundingBox.extendSize.x;

      expect(sphere instanceof BABYLON.Mesh).toBeTruthy();
      expect(sphere.position.x).toEqual(sphereConfig.position.x);
      expect(sphere.position.y).toEqual(sphereConfig.position.y);
      expect(sphere.position.z).toEqual(sphereConfig.position.z);

      expect(realRadius).toEqual(sphereConfig.radius);

      expect(sphere.name).toEqual(sphereConfig.name);
    });

    it('can create a cylinder from given config', function() {
      const radius = 0.047625347;
      const cylinderConfig =   {
        name: "leftTop",
        diameterTop: radius * 2,
        diameterBottom: radius * 2,
        height: 0.5,
        position: {
          x: -1.2991,
          y: 0,
          z: -0.6641
        }
      }

      const cylinder = this.objectBuilder.createCylinder(cylinderConfig);

      expect(cylinder instanceof BABYLON.Mesh).toBeTruthy();
      expect(cylinder.position.x).toEqual(cylinderConfig.position.x);
      expect(cylinder.position.y).toEqual(cylinderConfig.position.y);
      expect(cylinder.position.z).toEqual(cylinderConfig.position.z);

      expect(cylinder.name).toEqual(cylinderConfig.name);
    });
  });
});
