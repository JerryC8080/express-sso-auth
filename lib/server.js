/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */

'use strict';
const express = require('express');
const cors = require('cors');
const jwt = require('./jwt');
const ssoScript = (() => {  // storing sso.js script in memory cache.
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(path.join(__dirname, '../scripts/sso.js'), 'utf8');
})();

module.exports = function (options) {
  const opt = {
    cookie  : options.cookie || 'ssoToken',  // the name of cookie.
    header  : options.header || 'X-SSO-Auth',   // the header name of token set.
    expires : options.expires  || '1 hour',   // expiration of token.

    // group by client.name
    keys    : (() => {
      let clientObj = {};
      if (options.clients) {
        for (let client of options.clients){
          if (client.name && client.key) clientObj[client.name] = client.key;
        }
      }
      return clientObj;
    })(),

    origins : (() => {
      let origins = [];
      if (options.clients){
        for (let client of options.clients){
          if (client.name && client.host) origins.push(client.host);
        }
      }
      return origins;
    })(),

    // Before serialize user , the variable user and client should be provided.
    // The user which was serialized that will be deserialize and get the same user in client.
    beforeSerializeUser : options.beforeSerializeUser || function (req, res, next) {
      let user = req.user;
      let client = req.query.client || (req.body && req.body.client) || req.params.client;
      if (!user) return next(new Error('user was not found'));
      if (!client) return next(new Error('params client was not found'));
      return next(null, user, client);
    },

    authorizeRoute: options.authorizeRoute || null,
    serverHost    : options.serverHost || null
  };

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
            opt.beforeSerializeUser(req, res, (err, user, client) => {
              if (err) return next(err);
              // get key of client
              let key = opt.keys[client];
              // then encode user by jwt
              let userToken = jwt.serializeUser(user, key, opt.expires);
              // create ssoToken: jwtToken:uid:timestamp
              // TODO make the template different for different application which use this npm package.
              ssoToken = `${userToken}:${Date.now()}`;

              // TODO to storing ssoToken
            });
          }

          // set it in header X-SSO-Auth
          res.set(opt.header, ssoToken);
          // then next
          return res.sendStatus(200);
        });
        router.use(opt.authorizeRoute, [cors({
          credentials: true,
          origin: opt.origins,
          exposedHeaders: opt.header
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
            window.ssoConfig.ucHost = '${opt.serverHost}';
            window.ssoConfig.clientName = '${client}';
            window.ssoConfig.authorizeRoute = '${opt.authorizeRoute}';
            window.ssoConfig.token = {};
            window.ssoConfig.token.header = '${opt.header}';
            window.ssoConfig.token.cookie = '${opt.cookie}';
          `;
          return res.status(200).type("js").send(ssoConfig + ssoScript);
        }
      }
    }
  }
};