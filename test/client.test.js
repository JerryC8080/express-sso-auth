/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const config = {
  token: {
    cookie: {
      name: 'ssoToken',
      domain: 'localhost',
    }
  }
};
const should = require('should');
const httpMocks = require('node-mocks-http');
const SSOAuth = require('../index');
const ssoServer = SSOAuth.createServer(config);
const ssoClient = SSOAuth.createClient(config);

describe("client", () => {
  let user = {name: 'jerryc'};
  let ssoToken = ssoServer.api.generateToken(user).ssoToken;
  describe("middleware", () => {
    describe("#verify", () => {
      it("should decode ssoToken success", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        request.cookies[config.token.cookie.name] = ssoToken;

        ssoClient.middleware.verify()(request, response, (err) => {
          should(err).not.be.ok();
          request.ssoAuth.should.have.property('user', user);
          request.ssoAuth.should.have.property('token', ssoToken);
          request.ssoAuth.should.have.property('expiration', ssoToken.split(':')[1]);
        });
      });

      it("ssoToken not exits", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        ssoClient.middleware.verify()(request, response, (err) => {
          should(err).have.property('Error');
          should(err).have.properties({
            code: '1',
            message: 'ssoToken not found'
          });
        });
      });

      it("ssoToken miss match", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        request.cookies[config.token.cookie.name] = {};
        ssoClient.middleware.verify()(request, response, (err) => {
          should(err).have.property('Error');
          should(err).have.properties({
            code: '2',
            message: 'ssoToken missing match'
          });
        });
      });

      it("ssoToken has overdue", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        request.cookies[config.token.cookie.name] = ssoToken.replace(/:.*$/, ':' + (Date.now() - 1000));
        ssoClient.middleware.verify()(request, response, (err) => {
          should(err).have.property('Error');
          should(err).have.properties({
            code: '3',
            message: 'ssoToken has been overdue'
          });
        });
      });

      it("ssoToken decode failed", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        request.cookies[config.token.cookie.name] = 'test';
        ssoClient.middleware.verify()(request, response, (err) => {
          should(err).have.property('Error');
          should(err).have.properties({
            code: '4',
            message: 'decode ssoToken failed'
          });
        });
      });
    });
  });
});