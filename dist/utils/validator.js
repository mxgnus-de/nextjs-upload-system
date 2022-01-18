"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURL = void 0;
function validateURL(url) {
    let urlreg = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    return urlreg.test(url);
}
exports.validateURL = validateURL;
