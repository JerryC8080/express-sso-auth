/**
 * @author JerryC
 * @date  16/5/28
 * @description Api collection for Server
 */
'use strict';
const jwt = require('../jwt');
const ms = require('ms');

module.exports = function() {
  const _this = this;
  const opts = _this.opts;
  const logger = _this.logger;

  /**
   * Generate Token
   * @desc This method will generate token of given user
   * @param user The user is a literal object that you want to encode and sent to clients which will decode and get the value of this object.
   * @param [clientName] The clientName that you configured in ssoServer.clients that for get the secret key for encode token. If clientName did't provide, it will looking for key of token
   * @returns {{ssoToken: *, expiration: (global.Date|Date), userToken: *}}
   */
  function generateToken(user, clientName) {
    if (!user) throw new Error('user is required');
    let key;
    if (!clientName){
      // If clientName not provide, use token.key
      key = opts.token.key;
      if (!key) throw new Error('The token.key not found, make sure you has been configured the token.key');
    } else {
      // get key of client
      key = opts.keys[clientName];
      if (!key) throw new Error('There not key match for client:' + clientName, '. Make sure you has been configured the ssoServer.clients ');
    }

    // then encode user by jwt
    let userToken = jwt.serializeUser(user, key, opts.token.expires);

    // create ssoToken: jwtToken:expiredTimestamp
    let expiration = Date.now() + ms(opts.token.expires);
    let ssoToken = `${userToken}:${expiration}`;
    return {
      ssoToken,
      expiration,
      userToken
    }
  }

  /**
   * Set Token
   * @desc This method will set ssoToken into cookie that configured in token.cookie.
   * @param res The express response reference
   * @param ssoToken The ssoToken that will set in cookie
   */
  function setToken(res, ssoToken) {
    res.cookie(opts.token.cookie.name, ssoToken, {
      domain: opts.token.cookie.domain || undefined,
      expires: new Date(Date.now() + ms(opts.token.expires)),
      httpOnly: true
    });
  }

  /**
   * Clear Token
   * @desc This method will clear ssoToken that in cookie.
   * @param res
   */
  function clearToken(res) {
    res.clearCookie(opts.token.cookie.name, {
      domain: opts.token.cookie.domain || undefined
    });
  }

  /**
   * Login
   * @desc This method will do these things:
   *  1. generate token via generateToken()
   *  2. set this token in to cookie via setToken()
   *  3. and then return token by callback method
   * @param user The user is a literal object that you want to encode and sent to clients which will decode and get the value of this object.
   * @param [clientName] The clientName that you configured in ssoServer.clients that for get the secret key for encode token. If clientName did't provide, it will looking for key of token
   * @param callback
   * @returns {*}
   */
  function login(user, clientName, callback) {
    let res = this.res;
    let err = null, token;
    try{
      token = generateToken(user, clientName).ssoToken;
      setToken(res, token);

      logger.info('The user login.');
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

  /**
   * Logout
   * @desc This method will logout user via clearToken()
   */
  function logout() {
    let res = this.res;
    clearToken(res);
  }

  return {
    generateToken,
    setToken,
    clearToken,
    login,
    logout,
    refresh: login
  }
};