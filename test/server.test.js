/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const express = require('express');
const app = express();
const SSOAuth = require('../index');
const ssoServer = SSOAuth.createServer();
const httpMocks = require('node-mocks-http');
const should = require('should');

describe("server", () => {
  describe("api", () => {
    describe("#generateToken", () => {

    });

    describe("#setToken", () => {

    });

    describe("#clearToken", () => {

    });

    describe("#login", () => {

    });
  });

  describe("middleware", () => {
    describe("#main", () => {
      let request  = httpMocks.createRequest();
      let response = httpMocks.createResponse();
      let user = {name: 'jerryc'};

      ssoServer.middleware.main()(request, response);
      request.ssoAuth.login(user, 'testSite', (err, token) => {
        should(err).be.null();
        should(token).be.ok();
        should(response.header().cookies).have.property('ssoToken');
      });
    });
  });
});