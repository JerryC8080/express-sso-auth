/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const Server = require('./class');
const logger = require('../logger');

module.exports = (opts) => {
  try{
    return new Server(opts);
  }catch(error){
    logger.error(error);
    // TODO error handle
  }
};