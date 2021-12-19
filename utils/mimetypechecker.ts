function isImage(mimetype: string) {
   const denyTypes = [''];
   if (denyTypes.includes(mimetype)) return false;
   return mimetype.startsWith('image/') ? true : false;
}

function isVideo(mimetype: string) {
   const denyTypes = ['video/vnd.dlna.mpeg-tts'];
   if (denyTypes.includes(mimetype)) return false;
   return mimetype.startsWith('video/') ? true : false;
}

function isAudio(mimetype: string) {
   const denyTypes = [''];
   if (denyTypes.includes(mimetype)) return false;
   return mimetype.startsWith('audio/') ? true : false;
}

export { isImage, isVideo, isAudio };
