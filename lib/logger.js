/**
 * @author JerryC
 * @date  16/5/29
 * @description
 */
'use strict';
const winston = require('winston');
const logConfig = require('./default').logger;
const _ = require('lodash');

module.exports = function () {
  let _logConfig;
  if (this && this.opts && this.opts.logger){
    _logConfig = _.defaultsDeep(this.opts.logger, logConfig);
  } else {
    _logConfig = logConfig;
  }
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(_logConfig),
    ]
  })
};