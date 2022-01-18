"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const uploadKey_1 = require("../../api/uploadKey");
async function middleware(req, res, next) {
    const uploadKey = req.cookies.get('upload_key');
    const privatePages = ['/', '/shorter'];
    let blockedPage = false;
    privatePages.forEach((page) => {
        if (req.path === page)
            blockedPage = true;
    });
    if (req.path.startsWith('/dashboard'))
        blockedPage = true;
    const isValideUploadKey = await (0, uploadKey_1.validateUploadKey)(uploadKey);
    if (!isValideUploadKey && !req.path.startsWith('/login') && blockedPage) {
        return res.redirect('/login?redirect=' + req.path);
    }
    return next();
}
exports.middleware = middleware;
