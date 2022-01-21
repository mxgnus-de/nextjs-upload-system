import ConsoleLogger from '../../utils/consolelogger';
import mysql, { Connection as MySQLConnection, MysqlError } from 'mysql';
import { fileSQL, settingsSQL, userSQL, shortSQL } from './mysql';

class Connection {
   private connection: MySQLConnection;
   private password: string;
   public username: string;
   public host: string;
   public database: string;
   constructor(
      username: string,
      password: string,
      database: string,
      host: string,
   ) {
      this.username = username;
      this.password = password;
      this.database = database;
      this.host = host;
      this.connection = this.createConnection();
   }

   createConnection() {
      return mysql.createConnection({
         host: this.host,
         user: this.username,
         password: this.password,
         database: this.database,
      });
   }

   public connect() {
      try {
         this.connection.connect();
      } catch (error) {
         new ConsoleLogger(
            'Failed to connect to the database: ' +
               this.database +
               ' (' +
               this.username +
               ', ' +
               this.host +
               ')\n' +
               error,
         ).error();
      }
   }

   public getConnection() {
      return this.connection;
   }

   public utils() {
      this.connection.on('error', (error: MysqlError) => {
         if (error.fatal) this.reconnect();
      });
   }

   public reconnect() {
      this.connection.destroy();
      this.connection = this.createConnection();
      setTimeout(() => {
         this.connect();
         new ConsoleLogger(
            'Connected to the database: ' + this.database,
         ).info();
      }, 100);
   }

   public handleError(error: MysqlError) {
      new ConsoleLogger(
         'Error in database: ' +
            this.database +
            ' (' +
            this.username +
            ', ' +
            this.host +
            ')\n' +
            error.sqlMessage +
            '\n' +
            error.message,
      ).error();

      if (
         error?.fatal ||
         error?.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
      ) {
         new ConsoleLogger(
            'Error: ' +
               error.code +
               '\nMessage: ' +
               error.message +
               '\nQuery: ' +
               error?.sql,
         ).error();
         this.reconnect();
         fileSQL.setConnection(this.connection);
         settingsSQL.setConnection(this.connection);
         userSQL.setConnection(this.connection);
         shortSQL.setConnection(this.connection);
      }
   }

   public query(query: string) {
      return new Promise((resolve, reject) => {
         this.connection.query(query, (error, results, fields) => {
            if (error) {
               reject(error);
               this.handleError(error);
            } else {
               resolve(results);
            }
         });
      });
   }
}

export default Connection;
