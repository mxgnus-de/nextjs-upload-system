"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlstring_1 = __importDefault(require("sqlstring"));
const mysql_1 = require("./mysql");
class userSQL {
    connection;
    database;
    isInit = false;
    constructor(connection) {
        this.connection = connection;
        this.database = 'users';
        this.init();
    }
    async init() {
        if (this.isInit)
            return;
        this.isInit = true;
        const query = 'CREATE TABLE IF NOT EXISTS `' +
            this.database +
            '` (`key` varchar(500) NOT NULL,`username` varchar(50) NOT NULL,PRIMARY KEY (`key`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
        this.connection.query(query);
        const defaultuser = await this.getUser('changeme');
        const users = await this.getAllUsers();
        if (defaultuser.length === 0 && users.length === 0) {
            this.createNewUser('changeme', 'default');
        }
    }
    getUser(uploadKey) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('SELECT * FROM ' + this.database + ' WHERE `key` = ?', [uploadKey]), (error, results, fields) => {
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
    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ' + this.database, (error, results, fields) => {
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
    deleteUser(uploadKey) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('DELETE FROM ' + this.database + ' WHERE `key` = ?', [uploadKey]), (error, results, fields) => {
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
    updateUser(newUploadKey, username, uploadKey) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('UPDATE ' +
                this.database +
                ' SET `username` = ?, `key` = ? WHERE `key` = ?', [username, newUploadKey, uploadKey]), (error, results, fields) => {
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
    createNewUser(uploadKey, username) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('INSERT INTO ' +
                this.database +
                ' (`KEY`, `USERNAME`) VALUES (?, ?)', [uploadKey, username]), (error, results, fields) => {
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
exports.default = userSQL;
