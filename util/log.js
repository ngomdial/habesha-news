'use strict';

const winston = require('winston');
const morgan = require('morgan');
const moment = require('moment');
const morganFormat = `:date[iso] - /:method :url HTTP/:http-version :status :response-time ms - :res[content-length]`;
const env = process.env.NODE_ENV;

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

Log.e = message => Log.show('error', message);
Log.w = message => Log.show('warn', message);
Log.i = message => Log.show('info', message);
Log.v = message => Log.show('verbose', message);
Log.d = message => Log.show('debug', message);
Log.s = message => Log.show('silly', message);

Log.show = (level, message) => {
    if (env !== 'test') {
        logger.log(level, message);
    }
};

module.exports = Log;