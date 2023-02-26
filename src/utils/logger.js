const winston = require('winston');
const moment = require('moment');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: `logs/error${moment().format('YYYY-MM-DD')}.log`, level: 'error' }),
        new winston.transports.File({ filename: `logs/info${moment().format('YYYY-MM-DD')}.log`, level: 'info' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const buildLogToRequest = (request) => {
    return logger.info(
        `Original url: ${request.originalUrl}\n 
      ---\n
      Query parameters: ${JSON.stringify(request.query)}\n
      ---\n
      Body: ${JSON.stringify(request.body)}\n
      ---\n
      Headers: ${JSON.stringify(request.headers)}\n
      ---\n
      Parameters: ${JSON.stringify(request.params)}`
    );
}

module.exports = {logger, buildLogToRequest};
