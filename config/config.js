// config/config.js
'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
  root: rootPath,
  app: {
    name: process.env.APP_NAME
  }
};
