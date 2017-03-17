const upperLimit = 0.04445;
const lowerLimit = -upperLimit;
const xInnerLimit = 1.3282;
const xOuterLimit = 1.4782;
const zInnerLimit = 0.6932;
const zOuterLimit = 0.8432;

const RailConfig = {
  boxes: [
    {
      id: "left",
      width: xOuterLimit - xInnerLimit,
      height: upperLimit - lowerLimit,
      depth: 2 * zOuterLimit,
      position: {
        x: xOuterLimit - (xOuterLimit - xInnerLimit) / 2,
        y: 0,
        z: 0
      }
    },
    {
      id: "right",
      width: xOuterLimit - xInnerLimit,
      height: upperLimit - lowerLimit,
      depth: 2 * zOuterLimit,
      position: {
        x: -(xOuterLimit - (xOuterLimit - xInnerLimit) / 2),
        y: 0,
        z: 0
      }
    },
    {
      id: "top",
      width: 2 * xOuterLimit,
      height: upperLimit - lowerLimit,
      depth: zOuterLimit - zInnerLimit,
      position: {
        x: 0,
        y: 0,
        z: zOuterLimit - (zOuterLimit - zInnerLimit) / 2
      }
    },
    {
      id: "bottom",
      width: 2 * xOuterLimit,
      height: upperLimit - lowerLimit,
      depth: zOuterLimit - zInnerLimit,
      position: {
        x: 0,
        y: 0,
        z: -(zOuterLimit - (zOuterLimit - zInnerLimit) / 2)
      }
    }
  ],
  mass: 0,
  restitution: 0.98
};

export default RailConfig;
