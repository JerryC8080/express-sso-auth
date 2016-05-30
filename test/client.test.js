/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';

const should = require('should');
const Client = require('../lib/client/index');

describe("client", () => {
  const client = Client({});
  console.log(client.opts);
});