import ConsoleLogger from '../../utils/consolelogger';
import mysql, { Connection as MySQLConnection } from 'mysql';

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

   connect() {
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

   getConnection() {
      return this.connection;
   }
}

export default Connection;
