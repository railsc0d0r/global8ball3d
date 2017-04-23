const holeDiameter = 0.047625347;

const HolesConfig = [
  {
    id: "leftTop",
    position: {
      x: -1.2991,
      z: -0.6641
    },
    diameter: holeDiameter
  }, {
    id: "leftBottom",
    position: {
      x: -1.2991,
      z: 0.6641
    },
    diameter: holeDiameter
  }, {
    id: "centerBottom",
    position: {
      x: -0.002645853,
      z: 0.6932
    },
    diameter: holeDiameter
  }, {
    id: "rightBottom",
    position: {
      x: 1.2991,
      z: 0.6641
    },
    diameter: holeDiameter
  }, {
    id: "rightTop",
    position: {
      x: 1.2991,
      z: -0.6641
    },
    diameter: holeDiameter
  }, {
    id: "centerTop",
    position: {
      x: -0.002645853,
      z: -0.6932
    },
    diameter: holeDiameter
  }
];

export default HolesConfig;
