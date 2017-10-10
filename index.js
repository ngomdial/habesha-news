'use strict';

require('dotenv').config();
require('./config');

const app           = require('express')();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const port          = process.env.PORT;
const base_url      = process.env.BASE_URL + '/' + process.env.VERSION;
// TODO: Add jwt authentication
const bearerToken   = require('express-bearer-token');

app.use(bodyParser.json());
app.use(morgan(':method :url :response-time :status :remote-addr'));
app.use(bearerToken());
// TODO: Setup middleware
app.use(base_url, require('./routes'));

app.listen(port, () => {
    console.log(`Habesha News API running on port ${port}`);
});