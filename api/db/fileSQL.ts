import ConsoleLogger from 'utils/consolelogger';
import { Connection } from 'mysql';
import sqlstring from 'sqlstring';

class FileSQL {
   private connection: Connection;

   constructor(connection: Connection) {
      this.connection = connection;
      this.init();
   }

   public init(): void {
      const query =
         'CREATE TABLE IF NOT EXISTS `files` (`name` varchar(50) NOT NULL,`mimetype` varchar(50) NOT NULL,`path` text NOT NULL,`originalfilename` text NOT NULL,PRIMARY KEY (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
      this.connection.query(query);
      return;
   }

   public selectFile(fileName: string): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('SELECT * FROM files WHERE name = ?', [fileName]),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public selectAllFiles() {
      return new Promise((resolve, reject) => {
         this.connection.query(
            'SELECT * FROM files',
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public createNewFile(
      fileName: string,
      mimetype: string,
      path: string,
      originalfilename: string,
   ) {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'INSERT INTO files (name, mimetype, path, originalfilename) VALUES (?, ?, ?, ?)',
               [fileName, mimetype, path, originalfilename],
            ),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public deleteFile(fileName: string) {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format('DELETE FROM files WHERE name = ?', [fileName]),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }
}

export default FileSQL;
