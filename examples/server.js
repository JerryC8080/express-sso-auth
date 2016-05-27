/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';
const app = require('express')();
const ssoAuth = require('../index');
const ssoServer = ssoAuth.createServer({
  ssoServer: {
    clients: [
      {name: 'siteA', key: '%^&*', host: 'http://localhost:3002'},
      {name: 'siteB', key: '%^&*', host: 'http://localhost:3003'}
    ],
    authorizeRoute: '/authorize',
    serverHost: 'http://localhost:3001'
  },
  token: {
    cookie: {
      domain: '.uo.com'
    }
  }
});

/**
 * ssoAuth will be serialize user that from req.user by default.
 * You custom this by rewrite options.beforeSerializeUser method
 */
app.use((req, res, next) => {
  req.user = {username: 'jc'};
  next();
});

app.use(ssoServer.middleware.authorize());

app.get('/afterLogin', (req, res, next) => {
  let ssoToken = ssoServer.api.generateToken(req.user, req.query.client);
  ssoServer.api.setTokenIntoCookie(res, ssoToken);
  return res.send('ok');
});

app.get('/sso.js', ssoServer.middleware.script());

app.get('/setUser', (req, res, next) => {
  ssoServer.api.setUserIntoCookie(req, res, 'siteA');
  return res.sendStatus(200);
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});