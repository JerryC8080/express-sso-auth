/**
 * @author JerryC
 * @date  16/5/29
 * @description
 */
'use strict';
const logger = require('../lib/logger');

describe("logger", () => {
  logger.info('logger info');
  logger.error('logger error');
  logger.debug('logger debug', {name: 'jc'});
});