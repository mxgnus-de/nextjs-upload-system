"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authroute_1 = __importDefault(require("./auth/authroute"));
const fs_1 = __importDefault(require("fs"));
const express_1 = require("express");
const consolelogger_1 = __importDefault(require("../../utils/consolelogger"));
const upload_1 = require("../../config/upload");
const embed_1 = require("../../config/embed");
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const api_1 = require("../../config/api");
const createEmbed_1 = __importDefault(require("../../utils/createEmbed"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const formidable_1 = __importDefault(require("formidable"));
const generateRandomString_1 = require("../../utils/generateRandomString");
const mysql_1 = require("../../api/db/mysql");
const mimetypechecker_1 = require("../../utils/mimetypechecker");
const path_1 = __importDefault(require("path"));
const mime_types_1 = __importDefault(require("mime-types"));
const validator_1 = require("../../utils/validator");
const dashboardroutes_1 = __importDefault(require("./dashboard/dashboardroutes"));
const isValidUser_1 = __importDefault(require("../../server/middleware/isValidUser"));
const apirouter = (0, express_1.Router)();
apirouter.use('/auth', authroute_1.default);
apirouter.use('/dashboard', isValidUser_1.default, dashboardroutes_1.default);
apirouter.post('/upload', isValidUser_1.default, (req, res) => {
    const form = new formidable_1.default.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const uploadKey = req.cookies.get('upload_key') ||
            fields.upload_key ||
            req.body.upload_key;
        const buffer = fs_1.default.readFileSync(files?.file?._writeStream?.path);
        fs_1.default.unlinkSync(files?.file?._writeStream?.path);
        const file = files?.file;
        const newFilename = (0, generateRandomString_1.generateRandomString)(15);
        const mimetype = file?.mimetype;
        const originalFilename = file?.originalFilename;
        const user = await mysql_1.userSQL.getUser(uploadKey);
        const extension = mime_types_1.default.extension(mimetype) || originalFilename.split('.').slice(-1);
        if ((0, mimetypechecker_1.isImage)(mimetype)) {
            const newFilePath = path_1.default.resolve(upload_1.paths.image, newFilename + '.' + extension);
            mysql_1.fileSQL.createNewFile(newFilename, mimetype, newFilePath, originalFilename);
            uploadFile(upload_1.paths.image, newFilePath, buffer, newFilename, originalFilename, mimetype, user[0].username, extension, 'image');
        }
        else if ((0, mimetypechecker_1.isVideo)(mimetype)) {
            const newFilePath = path_1.default.resolve(upload_1.paths.video, newFilename + '.' + extension);
            mysql_1.fileSQL.createNewFile(newFilename, mimetype, newFilePath, originalFilename);
            uploadFile(upload_1.paths.video, newFilePath, buffer, newFilename, originalFilename, mimetype, user[0].username, extension, 'video');
        }
        else if ((0, mimetypechecker_1.isAudio)(mimetype)) {
            const newFilePath = path_1.default.resolve(upload_1.paths.audio, newFilename + '.' + extension);
            mysql_1.fileSQL.createNewFile(newFilename, mimetype, newFilePath, originalFilename);
            uploadFile(upload_1.paths.audio, newFilePath, buffer, newFilename, originalFilename, mimetype, user[0].username, extension, 'audio');
        }
        else {
            const newFilePath = path_1.default.resolve(upload_1.paths.data, newFilename + '.' + extension);
            mysql_1.fileSQL.createNewFile(newFilename, 'application/zip', newFilePath + '.zip', originalFilename);
            uploadFile(upload_1.paths.data, newFilePath, buffer, newFilename, originalFilename, mimetype, user[0].username, extension, 'data');
        }
        res.statusCode = 201;
        res.statusMessage = 'Created';
        return res.send(api_1.server + '/' + newFilename);
    });
    function checkIfDirExists(dir) {
        if (!fs_1.default.existsSync(upload_1.paths.upload)) {
            new consolelogger_1.default('DIR "' + upload_1.paths.upload + '" does not exist').error(true);
            new consolelogger_1.default('Creating directory "' + upload_1.paths.upload + '"').info(true);
            fs_1.default.mkdirSync(upload_1.paths.upload);
        }
        if (!fs_1.default.existsSync(dir)) {
            new consolelogger_1.default('DIR "' + dir + '" does not exist').error(true);
            new consolelogger_1.default('Creating directory "' + dir + '"').info(true);
            fs_1.default.mkdirSync(dir);
        }
    }
    function saveFile(path, buffer) {
        fs_1.default.writeFileSync(path, buffer);
    }
    function sendNotification(path, shortname, originalFilename, mimetype, username) {
        if (!embed_1.sendWebhook)
            return;
        axiosClient_1.default.post(embed_1.webhooknotification, {
            embeds: [
                new createEmbed_1.default(embed_1.newUploadEmbed.id, embed_1.newUploadEmbed.title, embed_1.newUploadEmbed.color, embed_1.newUploadEmbed.description
                    .replace('{originalfilename}', originalFilename)
                    .replace('{shortname}', shortname)
                    .replace('{shortURL}', api_1.server + '/' + shortname)
                    .replace('{path}', path)
                    .replace('{mimetype}', mimetype)
                    .replace('{username}', username)).build(),
            ],
        });
    }
    function uploadFile(dir, newFilePath, buffer, shortname, originalFilename, mimetype, extension, username, type) {
        checkIfDirExists(dir);
        saveFile(newFilePath, buffer);
        sendNotification(newFilePath, shortname, originalFilename, mimetype, username);
        if (type === 'data') {
            const zip = new adm_zip_1.default();
            zip.addLocalFile(newFilePath);
            zip.writeZip(newFilePath + '.zip');
            fs_1.default.unlinkSync(newFilePath);
            newFilePath = newFilePath + '.zip';
            console.log(newFilePath);
        }
        return;
    }
});
apirouter.post('/shorter', isValidUser_1.default, async (req, res) => {
    const { url } = req.body;
    if (!(0, validator_1.validateURL)(url)) {
        res.statusCode = 400;
        res.statusMessage = 'Bad Request | Invalid URL';
        return res.end();
    }
    const short = (0, generateRandomString_1.generateRandomString)(6);
    await mysql_1.shortSQL.createNewShortURL(short, url);
    const shortedURL = `${api_1.server}/links/${short}`;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    return res.send(shortedURL);
});
apirouter.get('/upload/:uploadID', async (req, res) => {
    const { uploadID } = req.params;
    if (!uploadID)
        return res.status(400).json({ error: 'No uploadID provided' });
    const file = await mysql_1.fileSQL.selectFile(uploadID);
    if (!file.length) {
        return res.status(404).json({ error: 'File not found' });
    }
    else {
        const mimetype = file[0].mimetype;
        const filePath = file[0].path;
        const originalFilename = file[0].originalfilename;
        if (!mimetype) {
            res.statusMessage = 'No mimetype provided';
            return res
                .status(400)
                .json({ status: 400, error: 'Invalid file type' });
        }
        const exist = fs_1.default.existsSync(filePath);
        if (!exist) {
            res.statusMessage = 'File not found';
            return res.status(404).json({ status: 404, error: 'File not found' });
        }
        const file_url = api_1.server +
            '/uploads' +
            filePath
                .replace(upload_1.paths.upload, '')
                .replaceAll('\\', '/')
                .replaceAll('//', '/');
        const resObj = {
            status: 200,
            mime_type: mimetype,
            original_filename: originalFilename,
            file_name: uploadID,
            file_extension: mime_types_1.default.extension(mimetype),
            file_path: file_url,
            file_path_name: file_url.split('/')[file_url.split('/').length - 1],
        };
        return res.status(200).json(resObj);
    }
});
apirouter.get('/links/:link', async (req, res) => {
    const { link } = req.params;
    if (!link)
        return res.status(400).json({ error: 'No link provided' });
    const shortedURL = await mysql_1.shortSQL.selectShortedURL(link);
    if (!shortedURL.length) {
        return res.status(404).json({ error: 'File not found' });
    }
    else {
        const url = shortedURL[0].url;
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            shortedLink: link,
            url,
        });
    }
});
exports.default = apirouter;
