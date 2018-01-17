'use strict';

const config = require('./protractor.shared.conf.js').config;
const port = process.env.WEBPACK_PORT || "8080";
config.baseUrl = `http://localhost:${port}/`;
config.port = port;

exports.config = config;
