"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlstring_1 = __importDefault(require("sqlstring"));
const mysql_1 = require("./mysql");
class FileSQL {
    connection;
    constructor(connection) {
        this.connection = connection;
        this.init();
    }
    init() {
        const query = 'CREATE TABLE IF NOT EXISTS `files` (`name` varchar(50) NOT NULL,`mimetype` varchar(50) NOT NULL,`path` text NOT NULL,`originalfilename` text NOT NULL,PRIMARY KEY (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
        this.connection.query(query);
        return;
    }
    selectFile(fileName) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('SELECT * FROM files WHERE name = ?', [fileName]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    selectAllFiles() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM files', (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    createNewFile(fileName, mimetype, path, originalfilename) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('INSERT INTO files (name, mimetype, path, originalfilename) VALUES (?, ?, ?, ?)', [fileName, mimetype, path, originalfilename]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    deleteFile(fileName) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('DELETE FROM files WHERE name = ?', [fileName]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}
exports.default = FileSQL;
