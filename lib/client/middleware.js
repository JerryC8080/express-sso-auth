/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const SSOError = require('../error');
const jwt = require('../jwt');

function verify() {
  const _this = this;
  const opts = _this.opts;
  const logger = _this.logger;

  return (req, res, next) => {

    // get ssoToken from header or cookie
    const ssoToken = req.header(opts.token.header) || req.cookies[opts.token.cookie.name];
    if (!ssoToken) return next(new SSOError(1));

    // decode ssoToken into two pieces : userToken, expiration
    let tokenObj;
    try{
      tokenObj = (function decodeUWToken(ssoToken) {
        let tokenArray = ssoToken.split(':');
        return {
          userToken: tokenArray[0],
          expiration: tokenArray[1]
        };
      })(ssoToken);
    }catch(error){
      return next(new SSOError(2));
    }

    // time check
    if (tokenObj.expiration < Date.now()){
      return next(new SSOError(3));
    }

    let user;
    try{
      let key = (opts.ssoClient.client && opts.ssoClient.client.key) || opts.token.key;
      user = jwt.deserializeUser(tokenObj.userToken, key);
      user.iat && delete user.iat;
      user.exp && delete user.exp;
      req.ssoAuth = {
        user: user,
        token: ssoToken,
        expiration: tokenObj.expiration
      };
    }catch(error){
      return next(new SSOError(4, error));
    }

    return next();
  };
}

module.exports = function() {
  return {
    verify: verify.bind(this)
  }
};