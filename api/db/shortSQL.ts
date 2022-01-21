import { Connection } from 'mysql';
import sqlstring from 'sqlstring';
import { connection } from './mysql';

class ShortSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   public init(): void {
      const query =
         'CREATE TABLE IF NOT EXISTS `shorter` (`name` varchar(50) NOT NULL,`url` text NOT NULL,PRIMARY KEY (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
      this.connection.query(query);
      return;
   }

   public setConnection(connection: Connection): void {
      this.connection = connection;
      return;
   }

   public selectShortedURL(shortedLink: string): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('SELECT * FROM shorter WHERE name = ?', [
               shortedLink,
            ]),
            (error, results, fields) => {
               if (error) {
                  reject(error);
                  return connection.handleError(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public selectAllShortedURLs(): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            'SELECT * FROM shorter',
            (error, results, fields) => {
               if (error) {
                  reject(error);
                  return connection.handleError(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public deleteShortURL(shortLink: string): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('DELETE FROM shorter WHERE name = ?', [shortLink]),
            (error, results, fields) => {
               if (error) {
                  reject(error);
                  return connection.handleError(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public createNewShortURL(shortLink: string, url: string) {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('INSERT INTO shorter (name, url) VALUES (?, ?)', [
               shortLink,
               url,
            ]),
            (error, results, fields) => {
               if (error) {
                  reject(error);
                  return connection.handleError(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }
}

export default ShortSQL;
