/**
 * @author JerryC
 * @date  16/5/29
 * @description
 */
'use strict';
const defaultConfig = require('../default');
const _ = require('lodash');
const middleware = require('./middleware');
const api = require('./api');

class Server {
  constructor(options) {
    let _opts = _.defaultsDeep(options, defaultConfig);
    // TODO params check

    let _clients = _opts.ssoServer.clients;
    if (!Array.isArray(_clients)) _clients = [_clients];
    _opts.origins = [];
    _opts.keys = {};
    _clients.forEach((client) => {
      if (client.name && client.key) _opts.keys[client.name] = client.key;
      if (client.name && client.host) _opts.origins.push(client.host);
    });

    this.opts = _opts;
    this.api = api.apply(this);
    this.middleware = middleware.apply(this);

  }
}

module.exports = Server;