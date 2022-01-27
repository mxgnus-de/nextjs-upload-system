import { Connection } from 'mysql';
import sqlstring from 'sqlstring';
import { connection } from './mysql';

class HasteSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   private init(): void {
      const query =
         'CREATE TABLE IF NOT EXISTS `haste` (`id` varchar(255) NOT NULL, `haste` text NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
      this.connection.query(query);
      return;
   }

   public setConnection(connection: Connection): void {
      this.connection = connection;
      return;
   }

   public createHaste(name: string, haste: string) {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('INSERT INTO haste (id, haste) VALUES (?, ?)', [
               name,
               haste,
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

   public getHaste(name: string): Promise<any> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('SELECT * FROM haste WHERE id = ?', [name]),
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

export default HasteSQL;
