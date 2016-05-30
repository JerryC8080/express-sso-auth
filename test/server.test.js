/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const config = {
  ssoServer: {
    clients: [{
      name: 'siteA',
      key: '123',
      host: 'http://localhost'
    }]
  },
  logger: {
    level: 'error'
  }
};
const SSOAuth = require('../index');
const ssoServer = SSOAuth.createServer(config);
const httpMocks = require('node-mocks-http');
const should = require('should');

describe("server", () => {
  let user = {name: 'jerryc'};

  describe("api", () => {
    describe("#generateToken", () => {
      let generateToken = ssoServer.api.generateToken;
      describe("clientName provided", () => {
        it("has key", () => {
          let tokenObj = generateToken(user, config.ssoServer.clients[0].name);
          tokenObj.should.have.properties(['ssoToken', 'userToken', 'expiration']);
        });

        it("hasn't key", () => {
          (() => generateToken(user, 'null')).should.throw(Error);
        });
      });

      describe("clientName not provided", () => {
        it("has key", () => {
          let tokenObj = generateToken(user);
          tokenObj.should.have.properties(['ssoToken', 'userToken', 'expiration']);
        });

        it("hasn't key", () => {
          ssoServer.opts.token.key = null;
          (() => {generateToken(user)}).should.throw(Error);
        });
      });



      it("user not provided", () => {
        (() => generateToken()).should.throw('user is required');
      });

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
      it("should login success", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();

        ssoServer.middleware.main()(request, response);
        request.ssoAuth.login(user, config.ssoServer.clients[0].name, (err, token) => {
          should(err).be.null();
          should(token).be.ok();
          should(response.header().cookies).have.property('ssoToken');
        });
      });
    });
  });
});