/**
 * @author JerryC
 * @date  16/5/29
 * @description
 *  The client Class.
 *  This class accept a custom options, and create a client instance
 *  that provide api and middleware collections of methods.
 */
'use strict';
const defaultConfig = require('../default');
const _ = require('lodash');
const middleware = require('./middleware');
const api = require('./api');

class Client {
  constructor(options) {
    this.opts = _.defaultsDeep(options, defaultConfig);
    // TODO check the integrity of options.
    this.middleware = middleware.apply(this);
    this.api = api.apply(this);
  }
}

module.exports = Client;