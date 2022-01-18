"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invaliduploadkey(response) {
    response.statusCode = 401;
    response.statusMessage = 'Unauthorized | Invalid upload key';
    return response.json({
        status: 401,
        error: 'Unauthorized | Invalid upload key',
    });
}
exports.default = invaliduploadkey;
