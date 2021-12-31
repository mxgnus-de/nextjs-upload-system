import ConsoleLogger from '../../utils/consolelogger';
import mysql, { Connection as MySQLConnection, MysqlError } from 'mysql';

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
      this.connection = mysql.createConnection({
         host: host,
         user: username,
         password: password,
         database: database,
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

   public events() {
      this.connection.on('error', (error: MysqlError) => {
         if (error.fatal) this.reconnect();
      });
   }

   public reconnect() {
      this.connection.destroy();
      this.connect();
   }
}

export default Connection;
