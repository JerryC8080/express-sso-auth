/**
 * @author JerryC
 * @date  16/5/31
 * @description
 */
'use strict';

function argRequired(name='') {
  throw new Error(name + ' arguments required');
}

module.exports = {
  argRequired
};