"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersionUpToDate = void 0;
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const github_1 = require("../../config/github");
const fs_1 = require("fs");
async function isVersionUpToDate() {
    const githubPackageJSON = await axiosClient_1.default
        .get(github_1.githubrepopackageJSON)
        .catch(() => { });
    const localpackage = JSON.parse((0, fs_1.readFileSync)(github_1.localpackageJSON, 'utf8'));
    const localversion = localpackage.version;
    const githubversion = githubPackageJSON?.data.version;
    return localversion === githubversion;
}
exports.isVersionUpToDate = isVersionUpToDate;
