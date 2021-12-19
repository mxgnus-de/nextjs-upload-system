import winston, { Logger as LoggerType, format } from 'winston';
const { combine, timestamp, prettyPrint, label } = format;

type LevelOptions =
   | 'error'
   | 'warn'
   | 'info'
   | 'http'
   | 'verbose'
   | 'debug'
   | 'silly';

const logger = winston.createLogger({
   level: 'info',
   format: combine(timestamp(), prettyPrint()),
   defaultMeta: { service: 'server' },
   transports: [
      new winston.transports.File({
         filename: 'logs/errors.log',
         level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
   ],
});

class Logger {
   private message: string;
   private level: LevelOptions;

   constructor(message: string, level: LevelOptions) {
      this.message = message;
      this.level = level;
   }

   public log(): void {
      logger.log({
         level: this.level,
         message: this.message,
      });
      return;
   }
}

export default Logger;
