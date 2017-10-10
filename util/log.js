'use strict';

const winston = require('winston');
const morgan = require('morgan');
const moment = require('moment');
const morganFormat = `:date[iso] - /:method :url HTTP/:http-version :status :response-time ms - :res[content-length]`;

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: moment(),
            level: 'silly',
            colorize: true
        })
    ]
});

function Log(app) {
    app.use(morgan(morganFormat));
}

const show = (level, message) => logger.log(level, message);

Log.e = message => show('error', message);
Log.w = message => show('warn', message);
Log.i = message => show('info', message);
Log.v = message => show('verbose', message);
Log.d = message => show('debug', message);
Log.s = message => show('silly', message);

module.exports = Log;