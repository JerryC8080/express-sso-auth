/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';

module.exports = {
  token: {
    // The name of cookie.
    cookie  : 'ssoToken',

    // The header name of token set.
    header  : 'X-SSO-Auth',

    // Expiration of token.
    expires : '1 hour'
  },

  ssoServer: {
    // Route of middleware that ssoServer.middleware.authorize served.
    authorizeRoute: '/sso/authorize',

    // The host of ssoServer.
    serverHost: 'http://localhost:3000',

    // Clients that ssoServer served.
    // Such as: [{name: 'siteA', key: '$%^&*', host: 'http://localhost:30001'}]
    // The param "name" that will be used in get sso.js script and get ssoToken.
    // The param "key" that will be used to encode user info.
    // The param "host" that will be used for CORS.
    clients: null
  },

  ssoClient: {
    // Like ssoServer, not array but object that include name and key (host param not required anymore).
    // Such as: {name: 'siteA', key: '$%^&*'}
    client: null
  },

  middleware: {
    // Before serialize user , the variable user and client should be provided.
    // The user which was serialized that will be deserialize and get the same user in client.
    beforeSerializeUser : (req, res, next) => {
      let user = req.user;
      let client = req.query.client || (req.body && req.body.client) || req.params.client;
      if (!user) return next(new Error('user was not found'));
      if (!client) return next(new Error('params client was not found'));
      return next(null, user, client);
    }
  },
};