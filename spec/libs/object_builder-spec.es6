import ObjectBuilder from '../../src/libs/object_builder';
import Scene from '../../src/models/scene';
import SurfaceMaterialsCreator from '../../src/libs/surface_materials_creator';
import HtmlFixtures from '../support/html_fixtures';
import NonValues from '../support/non_values';

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

  it('validates given object to be an instance of BABYLON.Scene', function() {
    const nonScenes = NonValues;
    nonScenes.forEach(nonScene => {
      const throwsAnException = () => ObjectBuilder.validateScene(nonScene);
      expect(throwsAnException).toThrow("Given object is not a scene.");
    });
  });

  describe('with a given scene', function() {
    describe('creates a box', function() {
      beforeEach(function() {
        const height = 0.02;

        this.boxConfig = {
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
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => ObjectBuilder.createBox(this.boxConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not a scene.");
        });
      });

      it('returning a mesh with given parameters', function() {
        const box = ObjectBuilder.createBox(this.boxConfig, this.scene);
        const dimensions = box.getBoundingInfo().boundingBox.extendSize.scale(2);

        expect(box instanceof BABYLON.Mesh).toBeTruthy();
        expect(box.position.x).toEqual(this.boxConfig.position.x);
        expect(box.position.y).toEqual(this.boxConfig.position.y);
        expect(box.position.z).toEqual(this.boxConfig.position.z);

        expect(dimensions.x).toEqual(this.boxConfig.width);
        expect(dimensions.y).toEqual(this.boxConfig.height);
        expect(dimensions.z).toEqual(this.boxConfig.depth);

        expect(box.name).toEqual(this.boxConfig.name);
      });
    });

    describe('creates a sphere', function() {
      beforeEach(function() {
        const radius = 0.4;
        this.sphereConfig = {
          name: 'test',
          radius: radius,
          position: {
            x: 0,
            y: radius,
            z: 0
          }
        };
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => ObjectBuilder.createSphere(this.sphereConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not a scene.");
        });
      });

      it('returning a mesh with given parameters', function() {
        const sphere = ObjectBuilder.createSphere(this.sphereConfig, this.scene);
        const realRadius = sphere.getBoundingInfo().boundingBox.extendSize.x;

        expect(sphere instanceof BABYLON.Mesh).toBeTruthy();
        expect(sphere.position.x).toEqual(this.sphereConfig.position.x);
        expect(sphere.position.y).toEqual(this.sphereConfig.position.y);
        expect(sphere.position.z).toEqual(this.sphereConfig.position.z);

        expect(realRadius).toEqual(this.sphereConfig.radius);

        expect(sphere.name).toEqual(this.sphereConfig.name);
      });
    });

    describe('creates a cylinder', function() {
      beforeEach(function() {
        const radius = 0.047625347;
        this.cylinderConfig = {
          name: "leftTop",
          diameterTop: radius * 2,
          diameterBottom: radius * 2,
          height: 0.5,
          position: {
            x: -1.2991,
            y: 0,
            z: -0.6641
          }
        };
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => ObjectBuilder.createCylinder(this.sphereConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not a scene.");
        });
      });

      it('returning a mesh with given parameters', function() {

        const cylinder = ObjectBuilder.createCylinder(this.cylinderConfig, this.scene);

        expect(cylinder instanceof BABYLON.Mesh).toBeTruthy();
        expect(cylinder.position.x).toEqual(this.cylinderConfig.position.x);
        expect(cylinder.position.y).toEqual(this.cylinderConfig.position.y);
        expect(cylinder.position.z).toEqual(this.cylinderConfig.position.z);

        expect(cylinder.name).toEqual(this.cylinderConfig.name);
      });
    });

    describe('creates a line', function() {
      beforeEach(function() {
        this.lineConfig = {
          name: "axis",
          points: [
            new BABYLON.Vector3(0,0,0),
            new BABYLON.Vector3(1,0,0)
          ]
        };
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => ObjectBuilder.createLine(this.lineConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not a scene.");
        });
      });

      it('checks if given points to create a line are vectors', function() {
        const lineConfig = {
          name: "axis",
          points: [
            new BABYLON.Vector3(0,0,0),
            {}
          ]
        };

        const throwsAnException = () => ObjectBuilder.createLine(lineConfig, this.scene);

        expect(throwsAnException).toThrow("At least one point given is not a BABYLON.Vector3-object.");
      });

      it('returning a mesh with given parameters', function() {
        const line = ObjectBuilder.createLine(this.lineConfig, this.scene);

        expect(line instanceof BABYLON.Mesh).toBeTruthy();
        expect(line.name).toEqual(this.lineConfig.name);
      });
    });

    describe('creates a polyhedron', function() {
      beforeEach(function() {
        const ball_diameter = 0.0291 * 2;
        const nose_height = ball_diameter * 0.65;
        const rail_height = 0.04445;

        const faces = [
              [0,1,2],
              [3,4,5],
              [0,1,4,3],
              [0,2,5,3],
              [1,4,5,2]
        ];

        const vertices = [
          [
            -1.27, nose_height, -0.560916126
          ], [
            -1.3282, 0, -0.624416589
          ], [
            -1.3282, rail_height, -0.624416589
          ], [
            -1.27, nose_height, 0.560916126
          ], [
            -1.3282, 0, 0.624416589
          ], [
            -1.3282, rail_height, 0.624416589
          ]
        ];

        const name = "left";

        this.polyhedronConfig = {
          name: "left",
          vertex: vertices,
          face: faces
        };
      });

      it('validating the scene first', function() {
        const nonScenes = NonValues;
        nonScenes.forEach(nonScene => {
          const throwsAnException = () => ObjectBuilder.createPolyhedron(this.polyhedronConfig, nonScene);
          expect(throwsAnException).toThrow("Given object is not a scene.");
        });
      });

      it('returning a mesh with given parameters', function() {
        const polyhedron = ObjectBuilder.createPolyhedron(this.polyhedronConfig, this.scene);

        expect(polyhedron).toEqual(jasmine.any(BABYLON.Mesh));
        expect(polyhedron.name).toEqual(this.polyhedronConfig.name);
      });
    });

    describe('frosts a given material', function() {
      it('validating it first', function() {
        NonValues.forEach(nonMaterial => {
          const throwsAnException = () => { ObjectBuilder.frostMaterial(nonMaterial) };

          expect(throwsAnException).toThrow('Given object to be frosted is not a material.');
        });
      });

      it('by setting its specularColor', function() {
        let material = new SurfaceMaterialsCreator(this.scene).surfaceMaterials.blue.clone('mattBlue');
        ObjectBuilder.frostMaterial(material);

        expect(material.specularColor).toEqual(BABYLON.Color3.FromHexString('#333333'));
      });

    });

    xit('requires an object of type BABYLON.Mesh if creating a physics_impostor for an object', function() {
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

      xit('requires an impostor_class if creating a physics_impostor for an object', function() {
        const throwsAnException = () => { this.objectBuilder.createPhysicsImpostor(this.mesh) };

        expect(throwsAnException).toThrow("You have to define the impostor class to create a PhysicsImpostor from. Possible values are SPHERE, BORDER or GROUND.");
      });

      xit('can create a physics_impostor for an object w/ given options', function() {
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

      xit('requires a name', function() {
        const nonStrings = NonValues;

        nonStrings.forEach(nonString => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(nonString) }
          expect(throwsAnException).toThrow("Name given for mesh to be created from CSG-object is not a valid string.");
        });
      });

      xit('checks the object given to be a CSG-object', function() {
        const nonCsgObjects = NonValues;

        nonCsgObjects.forEach(nonCsgObject => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(this.name, nonCsgObject) }
          expect(throwsAnException).toThrow("Object given to convert to mesh is not a CSG-object.");
        });
      });

      xit('requires a material', function() {
        const nonMaterials = NonValues;

        nonMaterials.forEach(nonMaterial => {
          const throwsAnException = () => { this.objectBuilder.convertCsgToMesh(this.name, this.csgSphere, nonMaterial) }
          expect(throwsAnException).toThrow("Material given to create a mesh from a CSG-object with is not a Material.");
        });
      });

      xit('returns a mesh with given name and material', function() {
        const mesh = this.objectBuilder.convertCsgToMesh(this.name, this.csgSphere, this.material);
        expect(mesh).toEqual(jasmine.any(BABYLON.Mesh));
        expect(mesh.name).toEqual(this.name);
        expect(mesh.material).toEqual(this.material);
      });
    });
  });
});
