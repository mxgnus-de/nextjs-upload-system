"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadKey = void 0;
const mysql_1 = require("./db/mysql");
async function validateUploadKey(key) {
    const user = await mysql_1.userSQL.getUser(key);
    return user[0] !== undefined && user[0]?.key === key;
}
exports.validateUploadKey = validateUploadKey;
