/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const logger = require('../logger');
const jwt = require('../jwt');
const ms = require('ms');

module.exports = function() {
  const _this = this;
  const opts = _this.opts;

  function generateToken(user, clientName) {
    // get key of client
    let key = opts.keys[clientName];
    // then encode user by jwt
    let userToken = jwt.serializeUser(user, key, opts.token.expires);
    // create ssoToken: jwtToken:uid:timestamp
    // TODO make the template different for different application which use this npm package.
    return `${userToken}:${Date.now()}`;
  }

  function setToken(res, ssoToken) {
    // if cookie configured
    res.cookie(opts.token.cookie.name, ssoToken, {
      domain: opts.token.cookie.domain || undefined,
      expires: new Date(Date.now() + ms(opts.token.cookie.expires))
    });
  }

  function clearToken(req, res) {
    if (opts.token.cookie){
      res.clearCookie(opts.token.cookie.name, {
        domain: opts.token.cookie.domain || undefined,
      });
    }
    return true;
  }

  function setUserIntoCookie(req, res, clientName, callback) {
    if (typeof clientName === 'function') {
      callback = clientName;
      clientName = null;
    } else if (!typeof callback === 'function'){
      callback = (err) => {
        // TODO err console
      }
    }
    opts.middleware.beforeSerializeUser(req, res, (err, user, client) => {
      if (clientName) client = clientName;
      if (err) return callback(err);
      let token = _generateToken(user, client);
      let result = _setTokenIntoCookie(res, token);
      if (callback) callback(result);
    });
  }

  function login(user, clientName, callback) {
    let res = this.res;
    let err = null, token;
    try{
      token = generateToken(user, clientName);
      setToken(res, token);

      logger.info('The user has been login.');
      logger.debug('The user obj:', user);
      logger.debug('The clientName:', clientName);
      logger.debug('The ssoToken:', token);

    }catch(error){
      logger.error(error);
      err = error;
    }
    if (callback){
      return callback(err, token);
    }
  }

  function logout() {
    let req = this.req;
    let res = this.res;
    clearToken(req, res);
  }
  
  function refresh() {
    
  }

  return {
    generateToken,
    setToken,
    clearToken,
    setUserIntoCookie,
    login,
    logout,
    refresh,
  }
};