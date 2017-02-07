var upper_limit = 0.04445;
var lower_limit = -upper_limit;
var x_inner_limit = 1.3282;
var x_outer_limit = 1.4782;
var z_inner_limit = 0.6932;
var z_outer_limit = 0.8432;

var RAIL_BOXES = [
    {
      id: "left",
      width: x_outer_limit - x_inner_limit,
      height: upper_limit - lower_limit,
      depth: 2 * z_outer_limit,
      position: {
        x: x_outer_limit - (x_outer_limit - x_inner_limit) / 2,
        y: 0,
        z: 0
      }
    },
    {
      id: "right",
      width: x_outer_limit - x_inner_limit,
      height: upper_limit - lower_limit,
      depth: 2 * z_outer_limit,
      position: {
        x: -(x_outer_limit - (x_outer_limit - x_inner_limit) / 2),
        y: 0,
        z: 0
      }
    },
    {
      id: "top",
      width: 2 * x_outer_limit,
      height: upper_limit - lower_limit,
      depth: z_outer_limit - z_inner_limit,
      position: {
        x: 0,
        y: 0,
        z: z_outer_limit - (z_outer_limit - z_inner_limit) / 2
      }
    },
    {
      id: "bottom",
      width: 2 * x_outer_limit,
      height: upper_limit - lower_limit,
      depth: z_outer_limit - z_inner_limit,
      position: {
        x: 0,
        y: 0,
        z: -(z_outer_limit - (z_outer_limit - z_inner_limit) / 2)
      }
    }
];