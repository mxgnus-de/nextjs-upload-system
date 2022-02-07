import { Connection } from 'mysql';
import sqlstring from 'sqlstring';
import { Haste } from '../../types/Dashboard';
import { connection } from './mysql';

class HasteSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   private init(): void {
      const query =
         'CREATE TABLE IF NOT EXISTS `haste` (`id` VARCHAR(255) NOT NULL, `haste` TEXT NOT NULL, `language` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`))';
      const query2 = 'SET NAMES "utf8mb4";';
      this.connection.query(query);
      this.connection.query(query2);
      return;
   }

   public setConnection(connection: Connection): void {
      this.connection = connection;
      return;
   }

   public createHaste(
      name: string,
      haste: string,
      language: string | null,
   ): Promise<any> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'INSERT INTO haste (id, haste, language) VALUES (?, ?, ?)',
               [name, haste, language],
            ),
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

   public getHaste(name: string): Promise<Haste[]> {
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

   public getAllHaste(): Promise<Haste[]> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            'SELECT * FROM haste',
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

   public deleteHaste(name: string): Promise<any> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('DELETE FROM haste WHERE id = ?', [name]),
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
