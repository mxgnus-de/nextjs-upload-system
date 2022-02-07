import { Connection } from 'mysql';
import { connection } from './mysql';

class SettingsSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   private async init() {
      this.connection.query(
         `CREATE TABLE IF NOT EXISTS settings (
            name VARCHAR(255) NOT NULL,
            value VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL DEFAULT 'boolean',
            PRIMARY KEY (name)
         )`,
      );
      const notifications = await this.getSetting('notifications');
      const publicHaste = await this.getSetting('publicHaste');
      const publicShorter = await this.getSetting('publicShorter');
      const publicUpload = await this.getSetting('publicUpload');
      const maxHasteLength = await this.getSetting('maxHasteLength');
      const maxHighlightLength = await this.getSetting('maxHighlightLength');
      if (notifications.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value) VALUES (?, ?)`,
            ['notifications', 'true'],
         );
      }
      if (publicHaste.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value) VALUES (?, ?)`,
            ['publicHaste', 'false'],
         );
      }
      if (publicShorter.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value) VALUES (?, ?)`,
            ['publicShorter', 'false'],
         );
      }
      if (publicUpload.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value) VALUES (?, ?)`,
            ['publicUpload', 'false'],
         );
      }
      if (maxHasteLength.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value, type) VALUES (?, ?, ?)`,
            ['maxHasteLength', '40000', 'number'],
         );
      }
      if (maxHighlightLength.length === 0) {
         this.connection.query(
            `INSERT INTO settings (name, value, type) VALUES (?, ?, ?)`,
            ['maxHighlightLength', '12500', 'number'],
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
