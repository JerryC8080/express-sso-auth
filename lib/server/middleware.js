/**
 * @author JerryC
 * @date  16/5/28
 * @description Middleware collection for Server
 */
'use strict';

function main(options) {
  let that = this;
  return (req, res, next) => {
    let api = that.api;
    that.req = res;
    that.res = res;

    req.ssoAuth = {
      login: api.login.bind(that),
      logout: api.logout.bind(that),
      refresh: api.refresh.bind(that),
    }
  }
}

function authorize() {
  
}

function script() {
  
}



module.exports = function() {
  return {
    main: main.bind(this)
  }
};