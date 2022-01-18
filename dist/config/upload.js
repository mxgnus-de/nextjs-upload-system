"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paths = void 0;
const path_1 = __importDefault(require("path"));
/* Do not change */
const paths = {
    files: path_1.default.resolve('.', 'files'),
    upload: path_1.default.resolve('.', 'files', 'uploads'),
    image: path_1.default.resolve('.', 'files', 'uploads', 'images'),
    video: path_1.default.resolve('.', 'files', 'uploads', 'videos'),
    audio: path_1.default.resolve('.', 'files', 'uploads', 'audios'),
    data: path_1.default.resolve('.', 'files', 'uploads', 'data'),
};
exports.paths = paths;
