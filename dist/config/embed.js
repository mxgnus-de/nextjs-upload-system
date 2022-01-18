"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebhook = exports.webhooknotification = exports.newUploadEmbed = void 0;
const devenv = process.env.NODE_ENV === 'development';
/* If true, send a webhook */
const sendWebhook = true;
exports.sendWebhook = sendWebhook;
const webhooknotification = 'https://discord.com/api/webhooks/918610496612106321/3yZN8k23ewdQJYZYlWJl0KOtKp7XS8KIj6_7EsbgsxfBmSrvTH-etYfVR3TZ3FpOI1wp';
exports.webhooknotification = webhooknotification;
const newUploadEmbed = {
    title: devenv ? 'New file uploaded [DEV]' : 'New file uploaded',
    color: 2096896,
    description: '**OriginalFilename**: ```{originalfilename}```' +
        '\n**Shortname**: ```{shortname}```' +
        '\n**ShortURL**: ```{shortURL}```' +
        '\n**Path**: ```{path}```' +
        '\n**Mimetype**: ```{mimetype}```' +
        '\n**Username**: ```{username}```',
    id: 0,
};
exports.newUploadEmbed = newUploadEmbed;
