import { devenv, server, serverdomain } from 'config/api';
import {
   newUploadEmbed,
   sendWebhook,
   webhooknotification,
   NewUploadEmbed,
} from 'config/embed';
import metaConfig from 'config/meta';
import mysqlConfig from 'config/mysql';
import { keys, paths } from 'config/upload';

function validateConfig() {}

export { validateConfig };
