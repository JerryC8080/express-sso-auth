/**
 * @author JerryC
 * @date  16/5/28
 * @description
 *  The main entrance of sso client.
 *  This module just a method that create and return new instance of client.
 */
"use strict";
const Client = require('./class');

module.exports = (opts) => {
  try{
    return new Client(opts);
  }catch(error){
    // TODO error handle
  }
};