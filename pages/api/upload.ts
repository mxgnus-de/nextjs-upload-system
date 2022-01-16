import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileSQL, userSQL } from 'api/db/mysql';
import { server } from 'config/api';
import { paths } from 'config/upload';
import mime from 'mime-types';
import { isAudio, isImage, isVideo } from 'utils/mimetypechecker';
import { generateRandomString } from 'utils/generateRandomString';
import ConsoleLogger from 'utils/consolelogger';
import axiosClient from 'api/axiosClient';
import Embed from 'utils/createEmbed';
import { newUploadEmbed, sendWebhook, webhooknotification } from 'config/embed';
import { validateUploadKey } from 'api/uploadKey';
import Cookies from 'cookies';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import invaliduploadkey from 'api/utils/response/invaliduploadkey';
import path from 'path';
import AdmZip from 'adm-zip';

export const config = {
   api: {
      bodyParser: false,
   },
};

export default async function upload(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   if (req.method === 'POST') {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files: any) {
         const cookies = new Cookies(req, res);
         const uploadKey =
            cookies.get('upload_key') ||
            fields.upload_key ||
            req.body.upload_key;
         if (!(await validateUploadKey(uploadKey || '')))
            return invaliduploadkey(res);
         const buffer = fs.readFileSync(files?.file?._writeStream?.path);

         fs.unlinkSync(files?.file?._writeStream?.path);

         const file = files?.file;
         const newFilename = generateRandomString(15);
         const mimetype = file?.mimetype;
         const originalFilename = file?.originalFilename;
         const user = await userSQL.getUser(uploadKey);

         const extension =
            mime.extension(mimetype) || originalFilename.split('.').slice(-1);

         if (isImage(mimetype)) {
            const newFilePath = path.resolve(
               paths.image,
               newFilename + '.' + extension,
            );
            fileSQL.createNewFile(
               newFilename,
               mimetype,
               newFilePath,
               originalFilename,
            );
            uploadFile(
               paths.image,
               newFilePath,
               buffer,
               newFilename,
               originalFilename,
               mimetype,
               user[0].username,
               'image',
            );
         } else if (isVideo(mimetype)) {
            const newFilePath = path.resolve(
               paths.video,
               newFilename + '.' + extension,
            );
            fileSQL.createNewFile(
               newFilename,
               mimetype,
               newFilePath,
               originalFilename,
            );
            uploadFile(
               paths.video,
               newFilePath,
               buffer,
               newFilename,
               originalFilename,
               mimetype,
               user[0].username,
               'video',
            );
         } else if (isAudio(mimetype)) {
            const newFilePath = path.resolve(
               paths.audio,
               newFilename + '.' + extension,
            );
            fileSQL.createNewFile(
               newFilename,
               mimetype,
               newFilePath,
               originalFilename,
            );
            uploadFile(
               paths.audio,
               newFilePath,
               buffer,
               newFilename,
               originalFilename,
               mimetype,
               user[0].username,
               'audio',
            );
         } else {
            const newFilePath = path.resolve(
               paths.data,
               newFilename + '.' + extension,
            );
            fileSQL.createNewFile(
               newFilename,
               'application/zip',
               newFilePath + '.zip',
               originalFilename,
            );
            uploadFile(
               paths.data,
               newFilePath,
               buffer,
               newFilename,
               originalFilename,
               mimetype,
               user[0].username,
               'data',
            );
         }

         res.statusCode = 201;
         res.statusMessage = 'Created';
         return res.send(server + '/' + newFilename);
      });
   } else {
      return methodnotallowed(res);
   }
}

function checkIfDirExists(dir: string) {
   if (!fs.existsSync(paths.upload)) {
      new ConsoleLogger('DIR "' + paths.upload + '" does not exist').error(
         true,
      );
      new ConsoleLogger('Creating directory "' + paths.upload + '"').info(true);
      fs.mkdirSync(paths.upload);
   }
   if (!fs.existsSync(dir)) {
      new ConsoleLogger('DIR "' + dir + '" does not exist').error(true);
      new ConsoleLogger('Creating directory "' + dir + '"').info(true);
      fs.mkdirSync(dir);
   }
}

function saveFile(path: string, buffer: Buffer) {
   fs.writeFileSync(path, buffer);
}

function sendNotification(
   path: string,
   shortname: string,
   originalFilename: string,
   mimetype: string,
   username: string,
) {
   if (!sendWebhook) return;
   axiosClient.post(webhooknotification, {
      embeds: [
         new Embed(
            newUploadEmbed.id,
            newUploadEmbed.title,
            newUploadEmbed.color,
            newUploadEmbed.description
               .replace('{originalfilename}', originalFilename)
               .replace('{shortname}', shortname)
               .replace('{shortURL}', server + '/' + shortname)
               .replace('{path}', path)
               .replace('{mimetype}', mimetype)
               .replace('{username}', username),
         ).build(),
      ],
   });
}

function uploadFile(
   dir: string,
   newFilePath: string,
   buffer: Buffer,
   shortname: string,
   originalFilename: string,
   mimetype: string,
   username: string,
   type: 'image' | 'video' | 'audio' | 'data',
): void {
   checkIfDirExists(dir);
   saveFile(newFilePath, buffer);
   sendNotification(
      newFilePath,
      shortname,
      originalFilename,
      mimetype,
      username,
   );
   if (type === 'data') {
      const zip = new AdmZip();
      zip.addLocalFile(newFilePath);
      zip.writeZip(newFilePath + '.zip');
      fs.unlinkSync(newFilePath);
      newFilePath = newFilePath + '.zip';
   }

   return;
}
