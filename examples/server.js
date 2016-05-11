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
    {name: 'siteA', key: '%^&*', host: 'http://localhost:3002'}
  ],
  authorizeRoute: '/authorize',
  serverHost: 'http://localhost:3001'
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

app.get('/sso.js', ssoServer.middleware.script());

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});