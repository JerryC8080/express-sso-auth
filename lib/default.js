/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';

module.exports = {
  token: {
    // The config of cookie.
    cookie  : {
      name: 'ssoToken',
      domain: null, // null mean current domain.
      expires: '1 hour'
    },

    shareCookie: true,  // or a string like ".site.com"

    // The header name of token set.
    header  : 'X-SSO-Auth',

    // Expiration of token.
    expires : '1 hour',

    // Save method will be executed after ssoToken generated.
    // You can rewrite this method to change token stored what you like.
    // By default, ssoToken will be stored in NeDB that built-in ssoAuth
    save: (tokenID, token, callback) => {
      // ...doing save.
      // and finally callback(null);
    },

    get: (tokenID, callback) => {
      // ...doing get.
      // and finally callback(null, token)
    },

    // This method will be executed before save method that make tokenID for it.
    // I also though you may be generate tokenID according req context.
    // The cause that save ssoToken just happen during http request, so i can make a deep copy of current req obj for you.
    makeID: (req, callback) => {
      // ..doing make id
      // and finally callback(null, tokenID);
    }
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
    clients: {
      name: 'testSite',
      key: '$%^&*',
      host: 'http://localhost'
    },
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

  // Config for winston logger
  logger: {
    // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    level: 'debug',
    label: 'SSOAuth',
    colorize: true,
  }
};