const appRoot = require('app-root-path');
const winston = require('winston');
const { combine, timestamp, label, printf,colorize } = winston.format;
require('winston-daily-rotate-file');
const myFormat = printf(info => {
  if(info instanceof Error) {
      return `${info.timestamp}  ${info.level}: ${info.message} ${info.stack}`;
  }
  return `${info.timestamp}  ${info.level}: ${info.message}`;

});

var transport = new (winston.transports.DailyRotateFile)({
  filename: `${appRoot}/logs/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level:'info',
});
var error_transport = new (winston.transports.DailyRotateFile)({
  filename: `${appRoot}/logs/application-error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level:'error',
});

var logger = winston.createLogger({
  format: combine(
    winston.format.splat(),
    timestamp(),
    myFormat,
),
  exitOnError: false,
  transports: [
    transport,
    error_transport
  ]
});

module.exports = logger;