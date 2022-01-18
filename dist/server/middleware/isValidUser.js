"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadKey_1 = require("../../api/uploadKey");
const invaliduploadkey_1 = __importDefault(require("../../api/utils/response/invaliduploadkey"));
async function isValidUser(req, res, next) {
    const uploadKey = req.cookies.get('upload_key') || req.headers['authorization'];
    if (!(await (0, uploadKey_1.validateUploadKey)(uploadKey))) {
        return (0, invaliduploadkey_1.default)(res);
    }
    else {
        return next();
    }
}
exports.default = isValidUser;
