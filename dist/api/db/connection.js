"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consolelogger_1 = __importDefault(require("../../utils/consolelogger"));
const mysql_1 = __importDefault(require("mysql"));
class Connection {
    connection;
    password;
    username;
    host;
    database;
    constructor(username, password, database, host) {
        this.username = username;
        this.password = password;
        this.database = database;
        this.host = host;
        this.connection = this.createConnection();
    }
    createConnection() {
        return mysql_1.default.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.database,
        });
    }
    connect() {
        try {
            this.connection.connect();
        }
        catch (error) {
            new consolelogger_1.default('Failed to connect to the database: ' +
                this.database +
                ' (' +
                this.username +
                ', ' +
                this.host +
                ')\n' +
                error).error();
        }
    }
    getConnection() {
        return this.connection;
    }
    utils() {
        this.connection.on('error', (error) => {
            if (error.fatal)
                this.reconnect();
        });
    }
    reconnect() {
        this.connection.destroy();
        setTimeout(() => {
            this.connect();
            new consolelogger_1.default('Connected to the database: ' + this.database).info();
        }, 100);
    }
    handleError(error) {
        new consolelogger_1.default('Error in database: ' +
            this.database +
            ' (' +
            this.username +
            ', ' +
            this.host +
            ')\n' +
            error.sqlMessage +
            '\n' +
            error.message).error();
        if (error?.fatal ||
            error?.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            new consolelogger_1.default('Error: ' +
                error.code +
                '\nMessage: ' +
                error.message +
                '\nQuery: ' +
                error?.sql).error();
            this.reconnect();
        }
    }
    query(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results, fields) => {
                if (error) {
                    reject(error);
                    this.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}
exports.default = Connection;
