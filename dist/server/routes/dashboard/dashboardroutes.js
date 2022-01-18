"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("../../../api/utils/github");
const github_2 = require("../../../config/github");
const express_1 = require("express");
const mysql_1 = require("../../../api/db/mysql");
const badrequest_1 = __importDefault(require("../../../api/utils/response/badrequest"));
const notfound_1 = __importDefault(require("../../../api/utils/response/notfound"));
const fs_1 = __importDefault(require("fs"));
const generateRandomString_1 = require("../../../utils/generateRandomString");
const dashboardrouter = (0, express_1.Router)();
dashboardrouter.get('/notifications', async (req, res) => {
    const isUpToDate = await (0, github_1.isVersionUpToDate)();
    const notificationsArray = [
        {
            show: !isUpToDate,
            message: 'There is a newer version of the program\nSee: ' + github_2.githubrepourl,
            name: 'update',
            url: github_2.githubrepourl,
        },
    ];
    return res.status(200).json({
        notifications: notificationsArray,
    });
});
dashboardrouter.get('/settings', async (req, res) => {
    const settings = await mysql_1.settingsSQL.getAllSettings();
    const finalSettings = [];
    settings.forEach((setting) => {
        finalSettings.push({
            name: setting.name,
            value: setting.value,
        });
    });
    return res.status(200).json(settings);
});
dashboardrouter.put('/settings', async (req, res) => {
    const action = req.query.action;
    const name = req.query.name;
    if (!action || !name)
        return (0, badrequest_1.default)(res);
    const settingSQL = await mysql_1.settingsSQL.getSetting(name || '');
    if (settingSQL.length === 0)
        return (0, badrequest_1.default)(res);
    const currentValue = settingSQL[0].value === 'true';
    if (action === 'toggle') {
        await mysql_1.settingsSQL.updateSetting(name, currentValue ? 'false' : 'true');
    }
    const newSettings = [];
    const settings = await mysql_1.settingsSQL.getAllSettings();
    settings.forEach((setting) => {
        newSettings.push({
            name: setting.name,
            value: setting.value,
        });
    });
    return res.status(200).json(newSettings);
});
dashboardrouter.get('/shorts', async (req, res) => {
    const shortedURLs = await mysql_1.shortSQL.selectAllShortedURLs();
    return res.status(200).json(shortedURLs);
});
dashboardrouter.delete('/shorts', async (req, res) => {
    const { shorturl } = req.query;
    const shortURL = await mysql_1.shortSQL.selectShortedURL(shorturl);
    if (!shorturl || shortURL.length === 0) {
        return (0, notfound_1.default)(res);
    }
    await mysql_1.shortSQL.deleteShortURL(shorturl);
    res.statusCode = 200;
    res.statusMessage = 'ShortURL deleted';
    return res.json({
        status: 200,
        message: 'ShortURL deleted',
    });
});
dashboardrouter.get('/uploads', async (req, res) => {
    const uploads = await mysql_1.fileSQL.selectAllFiles();
    return res.status(200).json(uploads);
});
dashboardrouter.delete('/uploads', async (req, res) => {
    const { filename } = req.query;
    const file = await mysql_1.fileSQL.selectFile(filename);
    if (!filename || file.length === 0) {
        return (0, notfound_1.default)(res);
    }
    await mysql_1.fileSQL.deleteFile(filename);
    fs_1.default.unlinkSync(file[0].path);
    res.statusCode = 200;
    res.statusMessage = 'File deleted';
    return res.json({
        status: 200,
        message: 'File deleted',
    });
});
dashboardrouter.get('/users', async (req, res) => {
    const users = await mysql_1.userSQL.getAllUsers();
    return res.status(200).json(users);
});
dashboardrouter.delete('/users', async (req, res) => {
    const { upload_key } = req.query;
    const user = await mysql_1.userSQL.getUser(upload_key);
    const allUsers = await mysql_1.userSQL.getAllUsers();
    if (!upload_key || user.length === 0) {
        return (0, notfound_1.default)(res);
    }
    if (allUsers.length - 1 === 0) {
        res.statusCode = 403;
        res.statusMessage = 'Cannot delete last user';
        return res.json({
            status: 403,
            message: 'Cannot delete last user',
        });
    }
    await mysql_1.userSQL.deleteUser(upload_key);
    res.statusCode = 200;
    res.statusMessage = 'User deleted';
    return res.json({
        status: 200,
        message: 'User deleted',
    });
});
dashboardrouter.put('/users', async (req, res) => {
    const uploadKey = req.cookies.get('upload_key');
    const { action } = req.query;
    if (action === 'changekey') {
        const newuploadkey = (0, generateRandomString_1.generateRandomString)(100);
        const { upload_key } = req.query;
        const user = await mysql_1.userSQL.getUser(upload_key);
        if (!upload_key || user.length === 0) {
            return (0, notfound_1.default)(res);
        }
        await mysql_1.userSQL.updateUser(newuploadkey, user[0].username, upload_key);
        res.statusCode = 200;
        res.statusMessage = 'User updated';
        return res.json({
            status: 200,
            message: 'User updated',
            newuploadkey,
        });
    }
    else if (action === 'changeusername') {
        const { newusername } = req.body;
        const user = await mysql_1.userSQL.getUser(uploadKey);
        if (!uploadKey || user.length === 0) {
            return (0, notfound_1.default)(res);
        }
        await mysql_1.userSQL.updateUser(uploadKey, newusername, user[0].key);
        res.statusCode = 200;
        res.statusMessage = 'User updated';
        return res.json({
            status: 200,
            message: 'User updated',
            newusername,
        });
    }
    else {
        return (0, badrequest_1.default)(res);
    }
});
dashboardrouter.post('/users', async (req, res) => {
    const { username } = req.body;
    const newuploadkey = (0, generateRandomString_1.generateRandomString)(100);
    await mysql_1.userSQL.createNewUser(newuploadkey, username);
    res.statusCode = 200;
    res.statusMessage = 'User created';
    return res.json({
        status: 200,
        message: 'User created',
        uploadkey: newuploadkey,
        username,
    });
});
exports.default = dashboardrouter;
