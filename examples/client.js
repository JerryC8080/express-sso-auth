/**
 * @author JerryC
 * @date  16/5/10
 * @description
 */
'use strict';
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const ssoAuth = require('../index');
const ssoClient = ssoAuth.createClient({
  ssoClient: {
    client: {name: 'siteA', key: '%^&*'}
  }
});

app.use(cookieParser());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use(express.static('page'));

app.get('/verify', ssoClient.middleware.verify(), (err, req, res, next) => {
  if (err){
    return res.status(400).send(err.message);
  }
  res.status(200).send(JSON.stringify(req.sso));
});

app.listen(3002, function () {
  console.log('Example app listening on port 3002!');
});