var upper_limit = 0.04445;
var lower_limit = -upper_limit;
var x_inner_limit = 1.3282;
var x_outer_limit = 1.4782;
var z_inner_limit = 0.6932;
var z_outer_limit = 0.8432;

var RAIL = {
    vertices: [
	{
	    x: -x_outer_limit,
	    y: upper_limit,
	    z: -z_outer_limit
	},
	{
	    x: x_outer_limit,
	    y: upper_limit,
	    z: -z_outer_limit
	},
	{
	    x: x_outer_limit,
	    y: upper_limit,
	    z: z_outer_limit
	},
	{
	    x: -x_outer_limit,
	    y: upper_limit,
	    z: z_outer_limit
	},
	{
	    x: -x_inner_limit,
	    y: upper_limit,
	    z: -z_inner_limit
	},
	{
	    x: x_inner_limit,
	    y: upper_limit,
	    z: -z_inner_limit
	},
	{
	    x: x_inner_limit,
	    y: upper_limit,
	    z: z_inner_limit
	},
	{
	    x: -x_inner_limit,
	    y: upper_limit,
	    z: z_inner_limit
	},
	{
	    x: -x_outer_limit,
	    y: lower_limit,
	    z: -z_outer_limit
	},
	{
	    x: x_outer_limit,
	    y: lower_limit,
	    z: -z_outer_limit
	},
	{
	    x: x_outer_limit,
	    y: lower_limit,
	    z: z_outer_limit
	},
	{
	    x: -x_outer_limit,
	    y: lower_limit,
	    z: z_outer_limit
	},
	{
	    x: -x_inner_limit,
	    y: lower_limit,
	    z: -z_inner_limit
	},
	{
	    x: x_inner_limit,
	    y: lower_limit,
	    z: -z_inner_limit
	},
	{
	    x: x_inner_limit,
	    y: lower_limit,
	    z: z_inner_limit
	},
	{
	    x: -x_inner_limit,
	    y: lower_limit,
	    z: z_inner_limit
	}
    ],
    faces: [
	[0,1,5,4],
	[1,2,6,5],
	[2,3,7,6],
	[3,0,4,7],
	[8,9,13,12],
	[9,10,14,13],
	[10,11,15,14],
	[11,8,12,15],
	[0,8,9,1],
	[1,9,10,2],
	[2,10,11,3],
	[3,11,8,0],
	[4,12,13,5],
	[5,13,14,6],
	[6,14,15,7],
	[4,12,15,7]
    ]
};
