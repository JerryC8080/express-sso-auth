/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */

'use strict';
const server = require('./lib/server');
const client = require('./lib/client');

module.exports = {
  /**
   * Create Server
   * default options:
   * {
   *   cookie: 'ssoToken',
   *   header: 'X-SSO-Auth',
   *   expires: '1 hour',
   *   beforeSerializeUser: function
   * }
   * @param options
   * @param options.clients required, such as: [{name: 'siteA', key: '$%^&*'}]
   * @param options.authorizeRoute required, the route of middleware.authorize serve., such as: /isLogin
   * @param options.serverHost required, the host of the server, such as: http://www.abc.com
   * @returns {{middleware}|*}
   */
  createServer: function (options) {
    return server(options);
  },
  createClient: function (options) {
    return client(options);
  }
};