"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubrepourl = exports.localpackageJSON = exports.githubrepopackageJSON = exports.githubapirepourl = void 0;
const path_1 = __importDefault(require("path"));
const githubrepourl = 'https://github.com/mxgnus-de/nextjs-upload-system';
exports.githubrepourl = githubrepourl;
const githubapirepourl = 'https://api.github.com/repos/mxgnus-de/nextjs-upload-system';
exports.githubapirepourl = githubapirepourl;
const githubrepopackageJSON = 'https://raw.githubusercontent.com/mxgnus-de/nextjs-upload-system/master/package.json';
exports.githubrepopackageJSON = githubrepopackageJSON;
const localpackageJSON = path_1.default.resolve('.', 'package.json');
exports.localpackageJSON = localpackageJSON;
