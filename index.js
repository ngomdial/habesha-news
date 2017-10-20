'use strict';

require('dotenv').config();
require('./config');

const app           = require('express')();
const bodyParser    = require('body-parser');
const port          = process.env.PORT;
const env           = process.env.NODE_ENV;
const baseUrl       = process.env.BASE_URL + '/' + process.env.VERSION;
// TODO: Add jwt authentication
const bearerToken   = require('express-bearer-token');
const validator     = require('express-validator');

const Log = require('./util/log');
new Log(app);
const log = Log;

app.use(bodyParser.json());
app.use(validator());
app.use(bearerToken());
// TODO: Setup authentication middleware

app.use(baseUrl, require('./routes'));

app.listen(port, () => log.i(`Habesha News API running in [${env}] on port ${port}`));

module.exports = app;