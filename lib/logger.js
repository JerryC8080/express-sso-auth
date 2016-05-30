/**
 * @author JerryC
 * @date  16/5/29
 * @description
 */
'use strict';
const winston = require('winston');
const logConfig = require('./default').logger;

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(logConfig),
  ]
});