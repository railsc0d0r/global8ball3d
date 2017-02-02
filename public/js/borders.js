var ball_diameter = 0.0291 * 2;
var nose_height = ball_diameter * 0.65;
var rail_height = 0.04445;

var BORDERS = {
    "left": [{
        "x": -1.27,
        "y": nose_height,
        "z": -0.560916126
    }, {
        "x": -1.3282,
        "y": 0,
        "z": -0.624416589
    }, {
        "x": -1.3282,
        "y": rail_height,
        "z": -0.624416589
    }, {
        "x": -1.27,
        "y": nose_height,
        "z": 0.560916126
    }, {
        "x": -1.3282,
        "y": 0,
        "z": 0.624416589
    }, {
        "x": -1.3282,
        "y": rail_height,
        "z": 0.624416589
    }],
    "leftTop": [{
        "x": -1.187978569,
        "y": nose_height,
        "z": 0.635
    }, {
        "x": -1.259416589,
        "y": 0,
        "z": 0.6932
    }, {
        "x": -1.259416589,
        "y": rail_height,
        "z": 0.6932
    }, {
        "x": -0.066146316,
        "y": nose_height,
        "z": 0.635
    }, {
        "x": -0.047625347,
        "y": 0,
        "z": 0.6932
    }, {
        "x": -0.047625347,
        "y": rail_height,
        "z": 0.6932
    }],
    "rightTop": [{
        "x": 0.066146316,
        "y": nose_height,
        "z": 0.635
    }, {
        "x": 0.047625347,
        "y": 0,
        "z": 0.6932
    }, {
        "x": 0.047625347,
        "y": rail_height,
        "z": 0.6932
    }, {
        "x": 1.187978569,
        "y": nose_height,
        "z": 0.635
    }, {
        "x": 1.259416589,
        "y": 0,
        "z": 0.6932
    }, {
        "x": 1.259416589,
        "y": rail_height,
        "z": 0.6932
    }],
    "right": [{
        "x": 1.3282,
        "y": rail_height,
        "z": -0.624416589
    }, {
        "x": 1.3282,
        "y": 0,
        "z": -0.624416589
    }, {
        "x": 1.27,
        "y": nose_height,
        "z": -0.560916126
    }, {
        "x": 1.3282,
        "y": rail_height,
        "z": 0.624416589
    }, {
        "x": 1.3282,
        "y": 0,
        "z": 0.624416589
    }, {
        "x": 1.27,
        "y": nose_height,
        "z": 0.560916126
    }],
    "rightBottom": [{
        "x": 0.066146316,
        "y": nose_height,
        "z": -0.635
    }, {
        "x": 0.047625347,
        "y": 0,
        "z": -0.6932
    }, {
        "x": 0.047625347,
        "y": rail_height,
        "z": -0.6932
    }, {
        "x": 1.187978569,
        "y": nose_height,
        "z": -0.635
    }, {
        "x": 1.259416589,
        "y": 0,
        "z": -0.6932
    }, {
        "x": 1.259416589,
        "y": rail_height,
        "z": -0.6932
    }],
    "leftBottom": [{
        "x": -0.047625347,
        "y": rail_height,
        "z": -0.6932
    }, {
        "x": -0.047625347,
        "y": 0,
        "z": -0.6932
    }, {
        "x": -1.259416589,
        "y": rail_height,
        "z": -0.6932
    }, {
        "x": -1.259416589,
        "y": 0,
        "z": -0.6932
    }, {
        "x": -1.187978569,
        "y": nose_height,
        "z": -0.635
    }, {
        "x": -0.066146316,
        "y": nose_height,
        "z": -0.635
    }]
}
