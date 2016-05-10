/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';

const jwt = require('jsonwebtoken');
module.exports = {
  serializeUser: function (user, key, expries) {
    return jwt.sign(user, key, {expiresIn: expries || '1hour'});
  },
  deserializeUser: function (token, key) {
    return jwt.verify(token, key);
  }
};