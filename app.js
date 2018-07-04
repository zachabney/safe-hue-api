const hue = require('./hue');

const SOFT_WHITE = 370;

const color = +process.argv[2] || SOFT_WHITE;

hue.setAllToColor(color);