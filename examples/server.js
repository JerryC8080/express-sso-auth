/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';
const app = require('express')();
const ssoAuth = require('../index');
const ssoServer = ssoAuth.createServer({
  clients: [
    {name: 'siteA', key: '%^&*', origin: 'http://localhost:3002'}
  ],
  authorizeRoute: '/authorize',
  serverHost: 'http://localhost:3001'
});

app.use((req, res, next) => {
  req.user = {username: 'jc'};
  next();
});

app.use(ssoServer.middleware.authorize());

app.get('/sso.js', ssoServer.middleware.script());

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});