/**
 * @author JerryC
 * @date  16/5/28
 * @description
 */
'use strict';
const config = {
  ssoServer: {
    clients: {
      name: 'siteA',
      key: '123',
      host: 'http://localhost'
    }
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

  describe("#createServer", () => {
    it("should throw error when config is error", () => {
      should(SSOAuth.createServer({ssoServer: null})).be.null();
    });
  });

  describe("api", () => {
    describe("#generateToken", () => {
      let generateToken = ssoServer.api.generateToken;
      describe("clientName provided", () => {
        it("has key", () => {
          let tokenObj = generateToken(user, config.ssoServer.clients.name);
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
        (() => generateToken()).should.throw('user arguments required');
      });

    });

    describe("#setToken", () => {
      let setToken = ssoServer.api.setToken;
      let ssoToken = ssoServer.api.generateToken(user);

      it("should set token in to cookie", () => {
        let response = httpMocks.createResponse();
        setToken(response, ssoToken);
        should(response.header().cookies).have.property('ssoToken');
        should(response.header().cookies.ssoToken.value).equal(ssoToken);
      });

      it("ssoToken not provided", () => {
        let response = httpMocks.createResponse();
        (() => setToken(response)).should.throw('ssoToken arguments required');
      });

      it("res not provided", () => {
        (() => setToken()).should.throw('res arguments required');
      });
    });

    describe("#clearToken", () => {
      let setToken = ssoServer.api.setToken;
      let clearToken = ssoServer.api.clearToken;
      let ssoToken = ssoServer.api.generateToken(user);
      let response = httpMocks.createResponse();

      setToken(response, ssoToken);
      should(response.header().cookies).have.property('ssoToken');

      clearToken(response);
      should(response.header().cookies).have.not.property('ssoToken');
    });
  });

  describe("middleware", () => {
    describe("#main", () => {
      describe("login and logout", () => {

        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();

        it("should login success", () => {
          ssoServer.middleware.main()(request, response);
          request.ssoAuth.login(user, config.ssoServer.clients.name, (err, token) => {
            should(err).be.null();
            should(token).be.ok();
            should(response.header().cookies).have.property('ssoToken');
          });
        });

        it("should logout success", () => {
          should(response.header().cookies).have.property('ssoToken');
          request.ssoAuth.logout();
          should(response.header().cookies).have.not.property('ssoToken');
        });
      });


      it("should catch error that setToken throw", () => {
        let request  = httpMocks.createRequest();
        let response = httpMocks.createResponse();
        ssoServer.middleware.main()(request, response);

        ssoServer.opts.token.key = null;
        request.ssoAuth.login(user, (err, token) => {
          should(err).not.be.null();
        });
      });
    });
  });
});