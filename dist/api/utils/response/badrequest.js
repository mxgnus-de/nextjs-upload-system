"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function badrequest(res) {
    res.statusCode = 400;
    res.statusMessage = 'Bad Request';
    return res.json({
        status: 400,
        error: 'Bad Request',
    });
}
exports.default = badrequest;
