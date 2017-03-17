const ball_diameter = 0.0291 * 2;
const nose_height = ball_diameter * 0.65;
const rail_height = 0.04445;

const bordersConfig = [
  {
    id: "left",
    vertices: [
      { x: -1.27, y: nose_height, z: -0.560916126 },
      { x: -1.3282, y: 0, z: -0.624416589 },
      { x: -1.3282, y: rail_height, z: -0.624416589 },
      { x: -1.27, y: nose_height, z: 0.560916126 },
      { x: -1.3282, y: 0, z: 0.624416589 },
      { x: -1.3282, y: rail_height, z: 0.624416589 }
    ]
  }, {
    id: "leftTop",
    vertices: [
      { x: -1.187978569, y: nose_height, z: 0.635 },
      { x: -1.259416589, y: 0, z: 0.6932 },
      { x: -1.259416589, y: rail_height, z: 0.6932 },
      { x: -0.066146316, y: nose_height, z: 0.635 },
      { x: -0.047625347, y: 0, z: 0.6932 },
      { x: -0.047625347, y: rail_height, z: 0.6932 }
    ]
  }, {
    id: "rightTop",
    vertices: [
      { x: 0.066146316, y: nose_height, z: 0.635 },
      { x: 0.047625347, y: 0, z: 0.6932 },
      { x: 0.047625347, y: rail_height, z: 0.6932 },
      { x: 1.187978569, y: nose_height, z: 0.635 },
      { x: 1.259416589, y: 0, z: 0.6932 },
      { x: 1.259416589, y: rail_height, z: 0.6932 }
    ]
  }, {
    id: "right",
    vertices: [
      { x: 1.3282, y: rail_height, z: -0.624416589 },
      { x: 1.3282, y: 0, z: -0.624416589 },
      { x: 1.27, y: nose_height, z: -0.560916126 },
      { x: 1.3282, y: rail_height, z: 0.624416589 },
      { x: 1.3282, y: 0, z: 0.624416589 },
      { x: 1.27, y: nose_height, z: 0.560916126 }
    ]
  }, {
    id: "rightBottom",
    vertices: [
      { x: 1.187978569, y: nose_height, z: -0.635 },
      { x: 1.259416589, y: 0, z: -0.6932 },
      { x: 1.259416589, y: rail_height, z: -0.6932 },
      { x: 0.066146316, y: nose_height, z: -0.635 },
      { x: 0.047625347, y: 0, z: -0.6932 },
      { x: 0.047625347, y: rail_height, z: -0.6932 }
    ]
  }, {
    id: "leftBottom",
    vertices: [
      { x: -0.066146316, y: nose_height, z: -0.635 },
      { x: -0.047625347, y: 0, z: -0.6932 },
      { x: -0.047625347, y: rail_height, z: -0.6932 },
      { x: -1.187978569, y: nose_height, z: -0.635 },
      { x: -1.259416589, y: 0, z: -0.6932 },
      { x: -1.259416589, y: rail_height, z: -0.6932 }
    ]
  }
];

export default bordersConfig;
