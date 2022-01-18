"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../config/api");
const cookies_1 = __importDefault(require("cookies"));
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const consolelogger_1 = __importDefault(require("../utils/consolelogger"));
const middleware_1 = require("./middleware/middleware");
const apiroute_1 = __importDefault(require("./routes/apiroute"));
require("../api/db/mysql");
const upload_1 = require("../config/upload");
const fs_1 = __importDefault(require("fs"));
const app = (0, next_1.default)({
    dev: api_1.devenv,
    conf: {
        reactStrictMode: true,
        poweredByHeader: false,
    },
});
const handle = app.getRequestHandler();
async function main() {
    if (!fs_1.default.existsSync(upload_1.paths.files))
        fs_1.default.mkdirSync(upload_1.paths.files);
    if (!fs_1.default.existsSync(upload_1.paths.upload))
        fs_1.default.mkdirSync(upload_1.paths.upload);
    await app.prepare().catch((err) => new consolelogger_1.default(err).error());
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.disable('x-powered-by');
    server.set('port', api_1.port);
    server.use(cookies_1.default.express(['keyA', 'keyB', 'keyC']));
    server.use(middleware_1.middleware);
    server.use(logRequest);
    server.use('/api', apiroute_1.default);
    server.use(express_1.default.static(upload_1.paths.files));
    server.all('*', (req, res) => handle(req, res));
    server.listen(api_1.port, (err) => {
        if (err) {
            new consolelogger_1.default(err).error(true);
            throw err;
        }
        new consolelogger_1.default(`Ready on http://localhost:${api_1.port}`).info();
    });
}
function logRequest(req, res, next) {
    if (!req.path.startsWith('/api'))
        return next();
    new consolelogger_1.default('[' +
        req.method +
        '] ' +
        (req.headers['x-forwarded-for'] || req.socket.remoteAddress) +
        ': ' +
        req.path).info(false);
    next();
}
main();
