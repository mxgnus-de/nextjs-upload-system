"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function notfound(response) {
    response.statusCode = 404;
    response.statusMessage = 'Not found | Source is not available';
    return response.json({
        status: 404,
        error: 'Not found | Source is not available',
    });
}
exports.default = notfound;
