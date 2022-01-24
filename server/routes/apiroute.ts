import authrouter from './auth/authroute';
import fs from 'fs';
import { Request, Response, Router } from 'express';
import ConsoleLogger from '../../utils/consolelogger';
import { paths } from '../../config/upload';
import {
   newUploadEmbed,
   sendWebhook,
   webhooknotification,
} from '../../config/embed';
import axiosClient from '../../api/axiosClient';
import { server } from '../../config/api';
import Embed from '../../utils/createEmbed';
import AdmZip from 'adm-zip';
import formidable from 'formidable';
import invaliduploadkey from '../../api/utils/response/invaliduploadkey';
import { generateRandomString } from '../../utils/generateRandomString';
import { fileSQL, shortSQL, userSQL } from '../../api/db/mysql';
import { isAudio, isImage, isVideo } from '../../utils/mimetypechecker';
import path from 'path';
import mime from 'mime-types';
import { validateURL } from '../../utils/validator';
import dashboardrouter from './dashboard/dashboardroutes';
import isValidUser from '../../server/middleware/isValidUser';
import getuploadkey from '../../server/modules/getuploadkey';
import hasterouter from './haste/hasteroute';

const apirouter = Router();

apirouter.use('/auth', authrouter);
apirouter.use('/dashboard', isValidUser, dashboardrouter);
apirouter.use('/haste', hasterouter);

apirouter.post('/upload', isValidUser, (req: Request, res: Response) => {
   const form = new formidable.IncomingForm();
   form.parse(req, async function (err, fields, files: any) {
      const uploadKey: any = getuploadkey(req) || fields.upload_key;
      if (!uploadKey) return invaliduploadkey(res);
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
            extension,
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
            extension,
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
            extension,
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
            extension,
            'data',
         );
      }

      res.statusCode = 201;
      res.statusMessage = 'Created';
      return res.send(server + '/' + newFilename);
   });

   function checkIfDirExists(dir: string) {
      if (!fs.existsSync(paths.upload)) {
         new ConsoleLogger('DIR "' + paths.upload + '" does not exist').error(
            true,
         );
         new ConsoleLogger('Creating directory "' + paths.upload + '"').info(
            true,
         );
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
      extension: string,
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
         console.log(newFilePath);
      }

      return;
   }
});

apirouter.post('/shorter', isValidUser, async (req: Request, res: Response) => {
   const { url } = req.body;

   if (!validateURL(url)) {
      res.statusCode = 400;
      res.statusMessage = 'Bad Request | Invalid URL';
      return res.end();
   }

   const short = generateRandomString(6);
   await shortSQL.createNewShortURL(short, url);
   const shortedURL = `${server}/links/${short}`;

   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   return res.send(shortedURL);
});

apirouter.get('/upload/:uploadID', async (req: Request, res: Response) => {
   const { uploadID } = req.params;

   if (!uploadID)
      return res.status(400).json({ error: 'No uploadID provided' });
   const file: any = await fileSQL.selectFile(uploadID as string);
   if (!file.length) {
      return res.status(404).json({ error: 'File not found' });
   } else {
      const mimetype: string = file[0].mimetype;
      const filePath: string = file[0].path;
      const originalFilename: string = file[0].originalfilename;

      if (!mimetype) {
         res.statusMessage = 'No mimetype provided';
         return res
            .status(400)
            .json({ status: 400, error: 'Invalid file type' });
      }

      const exist: boolean = fs.existsSync(filePath);
      if (!exist) {
         res.statusMessage = 'File not found';
         return res.status(404).json({ status: 404, error: 'File not found' });
      }

      const file_url =
         server +
         '/uploads' +
         filePath
            .replace(paths.upload, '')
            .replaceAll('\\', '/')
            .replaceAll('//', '/');
      const resObj = {
         status: 200,
         mime_type: mimetype,
         original_filename: originalFilename,
         file_name: uploadID,
         file_extension: mime.extension(mimetype),
         file_path: file_url,
         file_path_name: file_url.split('/')[file_url.split('/').length - 1],
      };

      return res.status(200).json(resObj);
   }
});

apirouter.get('/links/:link', async (req: Request, res: Response) => {
   const { link } = req.params;

   if (!link) return res.status(400).json({ error: 'No link provided' });
   const shortedURL: any = await shortSQL.selectShortedURL(link as string);
   if (!shortedURL.length) {
      return res.status(404).json({ error: 'File not found' });
   } else {
      const url = shortedURL[0].url;

      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
         shortedLink: link,
         url,
      });
   }
});

export default apirouter;
