"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadKey_1 = require("../../../api/uploadKey");
const express_1 = __importDefault(require("express"));
const invaliduploadkey_1 = __importDefault(require("../../../api/utils/response/invaliduploadkey"));
const mysql_1 = require("../../../api/db/mysql");
const generateRandomString_1 = require("../../../utils/generateRandomString");
const authrouter = express_1.default.Router();
authrouter.post('/login', async (req, res) => {
    const { uploadKey } = req.body;
    if (!(await (0, uploadKey_1.validateUploadKey)(uploadKey || '')))
        return (0, invaliduploadkey_1.default)(res);
    const user = await mysql_1.userSQL.getUser(uploadKey);
    if (user.length !== 0) {
        if (user[0].key === 'changeme' && user[0].username === 'default') {
            const newuploadkey = (0, generateRandomString_1.generateRandomString)(100);
            await mysql_1.userSQL.updateUser(newuploadkey, user[0].username, user[0].key);
            res.statusCode = 200;
            res.statusMessage = 'OK';
            return res.status(200).json({
                status: 200,
                success: true,
                uploadKey: newuploadkey,
                updated: true,
            });
        }
    }
    res.statusCode === 200;
    res.statusMessage = 'OK';
    return res.send({
        status: 200,
        success: true,
        uploadKey,
    });
});
authrouter.get('/validateuploadkey', async (req, res) => {
    const uploadKey = req.cookies.get('upload_key') ||
        req.headers['authorization'] ||
        req.body.upload_key;
    const valide = await (0, uploadKey_1.validateUploadKey)(uploadKey);
    res.statusCode === 200;
    res.statusMessage = 'OK';
    return res.send({
        success: true,
        upload_key: uploadKey,
        valide,
    });
});
exports.default = authrouter;
