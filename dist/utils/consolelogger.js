"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("./logger"));
class ConsoleLogger {
    message;
    constructor(message) {
        this.message = message;
    }
    info(logInLogfile) {
        // tslint:disable-next-line:no-console
        console.log(colors_1.default.grey(colors_1.default.green('Info | ') +
            colors_1.default.italic(moment_1.default.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')) +
            ' | ') + colors_1.default.cyan(this.message));
        // tslint:disable-next-line:no-unused-expression
        logInLogfile === true ? new logger_1.default(this.message, 'info').log() : '';
        return;
    }
    error(logInLogfile) {
        // tslint:disable-next-line:no-console
        console.log(colors_1.default.grey(colors_1.default.red('Error | ') +
            colors_1.default.italic(moment_1.default.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')) +
            ' | ') + colors_1.default.cyan(this.message));
        // tslint:disable-next-line:no-unused-expression
        logInLogfile === true ? new logger_1.default(this.message, 'error').log() : '';
        return;
    }
}
exports.default = ConsoleLogger;
