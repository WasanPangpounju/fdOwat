const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');

// Daily rotate file transport for errors
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: fileFormat,
});

// Daily rotate file transport for all logs
const combinedRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d', // Keep logs for 7 days
  format: fileFormat,
});

// Daily rotate file transport for debug logs (only in development)
const debugRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'debug-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'debug',
  maxSize: '20m',
  maxFiles: '3d', // Keep debug logs for 3 days
  format: fileFormat,
});

// Create the logger
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transports: [
    errorRotateTransport,
    combinedRotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug',
  }));
  logger.add(debugRotateTransport);
} else {
  // In production, only show errors and warnings in console
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'warn',
  }));
}

// Helper functions for common logging patterns
logger.accounting = {
  start: (endpoint, data) => logger.debug(`🚀 [ACCOUNTING] Start ${endpoint}`, data),
  success: (endpoint, data) => logger.info(`✅ [ACCOUNTING] Success ${endpoint}`, data),
  error: (endpoint, error) => logger.error(`❌ [ACCOUNTING] Error ${endpoint}`, { error: error.message, stack: error.stack }),
  
  workplace: (message, data) => logger.debug(`🏢 [WORKPLACE] ${message}`, data),
  employee: (message, data) => logger.debug(`👤 [EMPLOYEE] ${message}`, data),
  welfare: (message, data) => logger.debug(`💰 [WELFARE] ${message}`, data),
  sync: (message, data) => logger.debug(`🔄 [SYNC] ${message}`, data),
  conclude: (message, data) => logger.debug(`📊 [CONCLUDE] ${message}`, data),
};

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
