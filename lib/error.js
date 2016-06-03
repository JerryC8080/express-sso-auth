/**
 * @author JerryC
 * @date  16/6/3
 * @description
 */
'use strict';
const errorMap = {
  '1': 'ssoToken not found',
  '2': 'ssoToken missing match',
  '3': 'ssoToken has been overdue',
  '4': 'decode ssoToken failed'
};

class SSOError extends Error {
  constructor(code, error){
    code+='';
    let message = errorMap[code];
    if (!error){
      error = super(message);
    }
    return {
      Error   : error,
      message : message,
      code    : code
    }
  }
}

module.exports = SSOError;