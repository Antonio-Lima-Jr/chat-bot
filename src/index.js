const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const xhub = require('express-x-hub');
const morganBody = require('morgan-body');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Log = require('./utils/logger');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

// Cria arquivo de log
const logFile = fs.createWriteStream(
  path.join(
    __dirname, `../logs/requests${moment().format('YYYY-MM-DD')}.txt`), { flags: 'a' });

morganBody(app, {
  noColors: true,
  stream: logFile
});

const token = process.env.API_TOKEN || 'my_token';
let received_updates = [];

// Controllers
app.get('/', function (_, res) {
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get('/whatsapp', (req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/whatsapp', (req, res) => {
  Log.buildLogToRequest(req);

  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen(
  () => Log.logger.info(`Server running on port ${app.get('port')}`)
);