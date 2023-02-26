const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const xhub = require('express-x-hub');
const morganBody = require('morgan-body');
const fs = require('fs');
const path = require('path');
const moment = require('moment');


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

// Cria arquivo de log
const log = fs.createWriteStream(
  path.join(
    __dirname, `./logs/log${moment().format('YYYY-MM-DD')}.txt`,), { flags: 'a' });

morganBody(app, {
  noColors: true,
  stream: log
});

const token = process.env.API_TOKEN || 'my_token';
let received_updates = [];
app.get('/', function (req, res) {
  console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get(['/facebook', '/instagram'], function (req, res) {

  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
  res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function (req, res) {
  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/instagram', function (req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen();