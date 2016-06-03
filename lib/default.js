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
      domain: 'localhost', // null mean current domain.
    },

    shareCookie: true,  // or a string like ".site.com"

    // The header name of token set.
    header  : 'X-SSO-Auth',

    // Expiration of token.
    expires : '1 hour',

    // The key the encode and deocde token.
    key     : 'FGH%^&*()(*&^GSHJK&^^87yhjyuaj'
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

  // Config for winston logger
  logger: {
    // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    level: 'debug',
    label: 'SSOAuth',
    colorize: true,
  }
};