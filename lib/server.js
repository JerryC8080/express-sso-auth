/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */

'use strict';
const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const jwt = require('./jwt');
const defaultConfig = require('./default');
const ssoScript = (() => {  // storing sso.js script in memory cache.
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(path.join(__dirname, '../scripts/sso.js'), 'utf8');
})();

module.exports = function (options) {
  const opt = _.defaultsDeep(options, defaultConfig);

  // TODO To be optimize.
  opt.keys = (() => {
    let clientObj = {};
    if (options.ssoServer.clients) {
      for (let client of options.ssoServer.clients){
        if (client.name && client.key) clientObj[client.name] = client.key;
      }
    }
    return clientObj;
  })();

  // TODO To be optimize.
  opt.origins = (() => {
    let origins = [];
    if (options.ssoServer.clients){
      for (let client of options.ssoServer.clients){
        if (client.name && client.host) origins.push(client.host);
      }
    }
    return origins;
  })();

  // TODO check opt params and make waring

  return {
    middleware: {

      /**
       * Provide an interface to get ssoToken
       * The method will do these thing:
       * 1. see whether ssoToken has been stored, if it's, do not serialize user again.
       * 2. if ssoToken hasn't stored, serialize user
       * 3. then set ssoToken in res.header.
       * 4. next middleware
       */
      authorize: function (options) {
        if (!options) options = {};
        let router = express.Router();
        let middlewars = options.middlewares || [];
        middlewars.push((req, res, next) => {
          let ssoToken;

          // TODO to use NeDB for storing ssoToken of current user
          if (false){
            // get ssoToken if already in NeDB
          } else {
            // generate ssoToken if not exist.
            opt.middleware.beforeSerializeUser(req, res, (err, user, client) => {
              if (err) return next(err);
              // get key of client
              let key = opt.keys[client];
              // then encode user by jwt
              let userToken = jwt.serializeUser(user, key, opt.token.expires);
              // create ssoToken: jwtToken:uid:timestamp
              // TODO make the template different for different application which use this npm package.
              ssoToken = `${userToken}:${Date.now()}`;

              // TODO to storing ssoToken
            });
          }

          // set it in header X-SSO-Auth
          res.set(opt.token.header, ssoToken);
          // then next
          return res.sendStatus(200);
        });
        router.use(opt.ssoServer.authorizeRoute, [cors({
          credentials: true,
          origin: opt.origins,
          exposedHeaders: opt.token.header
        })].concat(middlewars));
        return router;
      },

      /**
       * Provide sso.js
       * @param options
       * @returns {Function}
       */
      script: function () {
        // check params of _opt

        return (req, res, next) => {
          const client = req.query.client || req.body.client;
          if (!client) return next(new Error('params client not found.'));
          // return sso.js that belong to client.
          let ssoConfig = `
            window.ssoConfig = {};
            window.ssoConfig.ucHost = '${opt.ssoServer.serverHost}';
            window.ssoConfig.clientName = '${client}';
            window.ssoConfig.authorizeRoute = '${opt.ssoServer.authorizeRoute}';
            window.ssoConfig.token = {};
            window.ssoConfig.token.header = '${opt.token.header}';
            window.ssoConfig.token.cookie = '${opt.token.cookie}';
          `;
          return res.status(200).type("js").send(ssoConfig + ssoScript);
        }
      }
    }
  }
};