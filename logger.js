require('winston-daily-rotate-file');
const logger = require('winston');
function setupLogger(dev) {
    if(!dev){
        logger.remove(logger.transports.Console);

        logger.add(new logger.transports.DailyRotateFile({
            filename: 'tmp/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level : 'error'
        }));
        logger.add(new logger.transports.DailyRotateFile({
            filename: 'tmp/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }));
        logger.level = 'debug';
    }
    return logger;
}

module.exports = setupLogger;
