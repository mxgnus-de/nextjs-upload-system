"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("./mysql");
class SettingsSQL {
    connection;
    constructor(connection) {
        this.connection = connection;
        this.init();
    }
    async init() {
        this.connection.query(`CREATE TABLE IF NOT EXISTS settings (
            name VARCHAR(255) NOT NULL,
            value VARCHAR(255) NOT NULL,
            PRIMARY KEY (name)
         )`);
        const notifications = await this.getSetting('notifications');
        if (notifications.length === 0) {
            this.connection.query(`INSERT INTO settings (name, value) VALUES (?, ?)`, ['notifications', 'true']);
        }
    }
    getSetting(name) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM settings WHERE name = ?`, [name], (error, results) => {
                if (error) {
                    return mysql_1.connection.handleError(error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
    getAllSettings() {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM settings`, (error, results) => {
                if (error) {
                    return mysql_1.connection.handleError(error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
    updateSetting(name, value) {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE settings SET value = ? WHERE name = ?`, [value, name], (error, results) => {
                if (error) {
                    return mysql_1.connection.handleError(error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}
exports.default = SettingsSQL;
