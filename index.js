'use strict';

require('dotenv').config();
require('./config');

const app           = require('express')();
const bodyParser    = require('body-parser');
const port          = process.env.PORT;
const env           = process.env.NODE_ENV;
const base_url      = process.env.BASE_URL + '/' + process.env.VERSION;
// TODO: Add jwt authentication
const bearerToken   = require('express-bearer-token');
const Log = require('./util/log');
new Log(app);
const log = Log;

app.use(bodyParser.json());
app.use(bearerToken());
// TODO: Setup middleware
app.use(base_url, require('./routes'));

app.listen(port, () => log.i(`Habesha News API running in [${env}] on port ${port}`));

module.exports = app;