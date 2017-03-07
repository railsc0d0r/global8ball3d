import ObjectBuilder from '../src/object_builder';
import Scene from '../src/scene';
import SurfaceMaterialsCreator from '../src/creators/surface_materials_creator';
import HtmlFixtures from './support/html_fixtures';
import NonValues from './support/non_values';

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

    it('can create a line from given config', function() {
      const lineConfig =   {
        name: "axis",
        points: [
          new BABYLON.Vector3(0,0,0),
          new BABYLON.Vector3(1,0,0)
        ]
      }

      const line = this.objectBuilder.createLine(lineConfig);

      expect(line instanceof BABYLON.Mesh).toBeTruthy();
      expect(line.name).toEqual(lineConfig.name);
    });

    it('checks if given points to create a line are vectors', function() {
      const lineConfig =   {
        name: "axis",
        points: [
          new BABYLON.Vector3(0,0,0),
          {}
        ]
      }

      const throwsAnException = () => this.objectBuilder.createLine(lineConfig);

      expect(throwsAnException).toThrow("At least one point given is not a BABYLON.Vector3-object.");
    });

    it('requires an object of type BABYLON.Mesh if creating a physics_impostor for an object', function() {
      NonValues.forEach(nonValue => {
        const throwsAnException = () => { this.objectBuilder.createPhysicsImpostor(nonValue) };

        expect(throwsAnException).toThrow("Object given to create a PhysicsImpostor for has to be an instance of mesh.");
      })
    });

    describe('w/ given mesh', function() {
      beforeEach(function() {
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

        this.mesh = this.objectBuilder.createSphere(sphereConfig);
        this.meshOptions = {
          mass: 0,
          restitution: 0.98
        };
      });

      it('requires an impostor_class if creating a physics_impostor for an object', function() {
        const throwsAnException = () => { this.objectBuilder.createPhysicsImpostor(this.mesh) };

        expect(throwsAnException).toThrow("You have to define the impostor class to create a PhysicsImpostor from. Possible values are SPHERE, BORDER or MESH.");
      });

      it('can create a physics_impostor for an object w/ given options', function() {
        const physicsImpostor = this.objectBuilder.createPhysicsImpostor(this.mesh, "SPHERE", this.meshOptions);

        expect(physicsImpostor).toEqual(jasmine.any(BABYLON.PhysicsImpostor));
        expect(physicsImpostor.getParam("mass")).toEqual(this.meshOptions.mass);
        expect(physicsImpostor.getParam("restitution")).toEqual(this.meshOptions.restitution);
      });
    });

    describe('if converting a given CSG-Object', function() {
      beforeEach(function() {
        this.name = "myMesh";

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
        this.csgSphere = BABYLON.CSG.FromMesh(sphere);

        this.material = new SurfaceMaterialsCreator(this.scene).surfaceMaterials.blue;
      });

      it('requires a name', function() {
        const nonStrings = NonValues;

        nonStrings.forEach(nonString => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(nonString) }
          expect(throwsAnException).toThrow("Name given for mesh to be created from CSG-object is not a valid string.");
        });
      });

      it('checks the object given to be a CSG-object', function() {
        const nonCsgObjects = NonValues;

        nonCsgObjects.forEach(nonCsgObject => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(this.name, nonCsgObject) }
          expect(throwsAnException).toThrow("Object given to convert to mesh is not a CSG-object.");
        });
      });

      it('requires a material', function() {
        const nonMaterials = NonValues;

        nonMaterials.forEach(nonMaterial => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(this.name, this.csgSphere, nonMaterial) }
          expect(throwsAnException).toThrow("Material given to create a mesh from a CSG-object with is not a Material.");
        });
      });

      it('returns a mesh with given name and material', function() {
        const mesh = this.objectBuilder.convertCsgToMesh(this.name, this.csgSphere, this.material);
        expect(mesh).toEqual(jasmine.any(BABYLON.Mesh));
        expect(mesh.name).toEqual(this.name);
        expect(mesh.material).toEqual(this.material);
      });
    });
  });
});
