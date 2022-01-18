"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAudio = exports.isVideo = exports.isImage = void 0;
function isImage(mimetype) {
    const denyTypes = [''];
    if (denyTypes.includes(mimetype))
        return false;
    return mimetype.startsWith('image/') ? true : false;
}
exports.isImage = isImage;
function isVideo(mimetype) {
    const denyTypes = ['video/vnd.dlna.mpeg-tts'];
    if (denyTypes.includes(mimetype))
        return false;
    return mimetype.startsWith('video/') ? true : false;
}
exports.isVideo = isVideo;
function isAudio(mimetype) {
    const denyTypes = [''];
    if (denyTypes.includes(mimetype))
        return false;
    return mimetype.startsWith('audio/') ? true : false;
}
exports.isAudio = isAudio;
