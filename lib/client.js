/**
 * @author JerryC
 * @date  16/5/10
 * @description
 * TODO beautify error handler
 */
'use strict';
const jwt = require('./jwt');

module.exports = function (options) {
  const opts = {
    client: options.client,
    token: {
      cookie: (options.token && options.token.cookie) || 'ssoToken',    // TODO move to default.js
      header: (options.token && options.token.header) || 'X-SSO-Auth'
    }
  };

  return {
    middleware: {
      verify: function () {
        return (req, res, next) => {

          // get ssoToken from header or cookie
          const ssoToken = req.header(opts.token.header) || req.cookies[opts.token.cookie];
          if (!ssoToken) return next(new Error('ssoToken not found'));

          // decode ssoToken into two pieces : userToken, timestamp
          let tokenObj;
          try{
            tokenObj = (function decodeUWToken(ssoToken) {
              let tokenArray = ssoToken.split(':');
              return {
                userToken: tokenArray[0],
                timestamp: tokenArray[1]
              };
            })(ssoToken);
          }catch(error){
            return next(new Error('ssoToken missing match'));
          }

          // TODO
          // get ssoToken from storer(may be NeDB).
          // check out timestamp that included in ssoToken, if unchanged, should not deserialize user.
          // if timestamp changed, deserialize user.

          let user = jwt.deserializeUser(tokenObj.userToken, opts.client.key);
          req.sso = {
            user: user,
            site: opts.client.site
          };
          return next();
        };
      }
    }
  }
};