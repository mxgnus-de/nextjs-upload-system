import colors from 'colors';
import moment from 'moment';
import Logger from './logger';

class ConsoleLogger {
   private message: string;

   constructor(message: string) {
      this.message = message;
   }

   public info(logInLogfile?: boolean): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.green('Info | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss'),
               ) +
               ' | ',
         ) + colors.cyan(this.message),
      );
      // tslint:disable-next-line:no-unused-expression
      logInLogfile === true ? new Logger(this.message, 'info').log() : '';
      return;
   }
   public error(logInLogfile?: boolean): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.red('Error | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss'),
               ) +
               ' | ',
         ) + colors.cyan(this.message),
      );
      // tslint:disable-next-line:no-unused-expression
      logInLogfile === true ? new Logger(this.message, 'error').log() : '';
      return;
   }
}

export default ConsoleLogger;
