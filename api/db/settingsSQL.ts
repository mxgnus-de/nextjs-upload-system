import { Connection } from 'mysql';
import { connection } from './mysql';

class SettingsSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   public async init() {
      this.connection.query(
         `CREATE TABLE IF NOT EXISTS settings (
            name VARCHAR(255) NOT NULL,
            value VARCHAR(255) NOT NULL,
            PRIMARY KEY (name)
         )`,
      );
      const notifications = await this.getSetting('notifications');
      if (notifications.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value) VALUES (?, ?)`,
            ['notifications', 'true'],
         );
      }
   }

   public setConnection(connection: Connection): void {
      this.connection = connection;
      return;
   }

   public getSetting(name: string): Promise<any[]> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            `SELECT * FROM settings WHERE name = ?`,
            [name],
            (error: any, results: any) => {
               if (error) {
                  return connection.handleError(error);
                  return reject(error);
               }
               resolve(results);
            },
         );
      });
   }

   public getAllSettings(): Promise<any[]> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            `SELECT * FROM settings`,
            (error: any, results: any) => {
               if (error) {
                  return connection.handleError(error);
                  return reject(error);
               }
               resolve(results);
            },
         );
      });
   }

   public updateSetting(name: string, value: string): Promise<any[]> {
      return new Promise((resolve, reject) => {
         this.connection.query(
            `UPDATE settings SET value = ? WHERE name = ?`,
            [value, name],
            (error: any, results: any) => {
               if (error) {
                  return connection.handleError(error);
                  return reject(error);
               }
               resolve(results);
            },
         );
      });
   }
}

export default SettingsSQL;
