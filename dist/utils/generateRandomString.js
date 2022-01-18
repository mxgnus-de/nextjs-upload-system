"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
function generateRandomString(length) {
    let value = '';
    for (let i = 0; i < length; i++) {
        value += 'x';
    }
    let date = new Date().getTime();
    let string = value.replace(/[xy]/g, function (c) {
        let r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return string;
}
exports.generateRandomString = generateRandomString;
