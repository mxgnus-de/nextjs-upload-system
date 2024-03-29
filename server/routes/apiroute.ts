import authrouter from './auth/authroute';
import fs from 'fs';
import { Request, Response, Router } from 'express';
import ConsoleLogger from '../../utils/consolelogger';
import { paths } from '../../config/upload';
import axiosClient from '../../api/axiosClient';
import Embed from '../../utils/createEmbed';
import AdmZip from 'adm-zip';
import formidable from 'formidable';
import invaliduploadkey from '../../api/utils/response/invaliduploadkey';
import { generateRandomString } from '../../utils/generateRandomString';
import { isAudio, isImage, isVideo } from '../../utils/mimetypechecker';
import path from 'path';
import mime from 'mime-types';
import { validateURL } from '../../utils/validator';
import dashboardrouter from './dashboard/dashboardroutes';
import isValidUser from '../../server/middleware/isValidUser';
import getuploadkey from '../../server/modules/getuploadkey';
import hasterouter from './haste/hasteroute';
import { validateUploadKey } from '../../api/uploadKey';
import badrequest from '../../api/utils/response/badrequest';
import { Setting } from '@prisma/client';
import { permissionsMap } from '../../utils/permissions';
import missingpermissions from '../../api/utils/response/missingpermissions';
import prisma from '../../prisma/client';

const apirouter = Router();

apirouter.use('/auth', authrouter);
apirouter.use('/dashboard', isValidUser, dashboardrouter);
apirouter.use('/haste', hasterouter);

apirouter.post('/upload', (req: Request, res: Response) => {
   const form = new formidable.IncomingForm();
   form.parse(req, async function (err, fields, files: any) {
      const uploadKey: any = getuploadkey(req) || fields.upload_key;
      const publicUploadSetting = await prisma.setting.findUnique({
         where: {
            name: 'publicUpload',
         },
      });
      const maxUploadSizeSetting = await prisma.setting.findUnique({
         where: {
            name: 'maxUploadSize',
         },
      });

      if (!publicUploadSetting)
         return badrequest(res, 'Public upload setting not found');

      const publicUpload = publicUploadSetting.value === 'true';
      const maxUploadSize = !isNaN(parseInt(maxUploadSizeSetting?.value ?? ''))
         ? parseInt(maxUploadSizeSetting?.value ?? '')
         : 50;

      let user = null;

      if (!publicUpload) {
         if (!(await validateUploadKey(uploadKey as string))) {
            return invaliduploadkey(res);
         }
      }

      if (uploadKey) {
         user = await prisma.user.findUnique({
            where: {
               key: uploadKey,
            },
         });
      }
      if (user) {
         const perms = permissionsMap(user.permissions);
         if (!perms.upload && !publicUpload)
            return missingpermissions(res, 'upload');
      }

      if (!files?.file) return badrequest(res, 'No file was uploaded');

      const buffer = fs.readFileSync(files?.file?._writeStream?.path);
      const fileStats = fs.statSync(files?.file?._writeStream?.path);
      const fileSize = fileStats.size;
      const fileSizeInMB = fileSize / (1024 * 1024);

      fs.unlinkSync(files?.file?._writeStream?.path);
      if (fileSizeInMB > maxUploadSize) {
         return badrequest(
            res,
            'File is too big, max upload size is ' + maxUploadSize + 'MB',
         );
      }

      const file = files?.file;
      const newFilename = generateRandomString(8);
      const mimetype = file?.mimetype;
      const originalFilename = file?.originalFilename;
      const username = uploadKey && user?.username ? user.username : 'Unknown';

      const extension =
         mime.extension(mimetype) || originalFilename.split('.').slice(-1);

      if (isImage(mimetype)) {
         const newFilePath = path.resolve(
            paths.image,
            newFilename + '.' + extension,
         );
         await prisma.file.create({
            data: {
               name: newFilename,
               mimetype,
               originalfilename: originalFilename,
               path: newFilePath,
               size: fileSize,
               createdAt: new Date(),
               ownerId: user ? user.id : null,
            },
         });
         uploadFile({
            dir: paths.image,
            newFilePath,
            buffer,
            mimetype,
            extension,
            originalFilename,
            shortname: newFilename,
            type: 'image',
            username,
         });
      } else if (isVideo(mimetype)) {
         const newFilePath = path.resolve(
            paths.video,
            newFilename + '.' + extension,
         );
         await prisma.file.create({
            data: {
               name: newFilename,
               mimetype,
               originalfilename: originalFilename,
               path: newFilePath,
               size: fileSize,
               createdAt: new Date(),
               ownerId: user ? user.id : null,
            },
         });
         uploadFile({
            dir: paths.video,
            newFilePath,
            buffer,
            mimetype,
            extension,
            originalFilename,
            shortname: newFilename,
            type: 'video',
            username,
         });
      } else if (isAudio(mimetype)) {
         const newFilePath = path.resolve(
            paths.audio,
            newFilename + '.' + extension,
         );
         await prisma.file.create({
            data: {
               name: newFilename,
               mimetype,
               originalfilename: originalFilename,
               path: newFilePath,
               size: fileSize,
               createdAt: new Date(),
               ownerId: user ? user.id : null,
            },
         });
         uploadFile({
            dir: paths.audio,
            newFilePath,
            buffer,
            mimetype,
            extension,
            originalFilename,
            shortname: newFilename,
            type: 'video',
            username,
         });
      } else {
         const newFilePath = path.resolve(
            paths.data,
            newFilename + '.' + extension,
         );
         const shouldZip = fileSizeInMB > 10;

         await prisma.file.create({
            data: {
               name: newFilename,
               mimetype: shouldZip ? 'application/zip' : mimetype,
               originalfilename: originalFilename,
               path: shouldZip ? newFilePath + '.zip' : newFilePath,
               size: fileSize,
               createdAt: new Date(),
               ownerId: user ? user.id : null,
            },
         });

         uploadFile({
            dir: paths.data,
            newFilePath,
            buffer,
            mimetype,
            extension,
            originalFilename,
            shortname: newFilename,
            type: 'data',
            username,
            zip: shouldZip,
         });
      }

      res.statusCode = 201;
      res.statusMessage = 'Created';
      return res.send(process.env.NEXT_PUBLIC_URL + '/' + newFilename);
   });
});

apirouter.get('/upload/:uploadID', async (req: Request, res: Response) => {
   const { uploadID } = req.params;

   if (!uploadID)
      return res.status(400).json({ error: 'No uploadID provided' });
   let file = await prisma.file.findUnique({
      where: {
         name: uploadID,
      },
   });

   if (!file) {
      file = await prisma.file.findFirst({
         where: {
            alias: uploadID,
         },
      });
   }

   if (!file) {
      return res.status(404).json({ error: 'File not found' });
   } else {
      const mimetype: string = file.mimetype;
      const filePath: string = file.path;
      const originalFilename: string = file.originalfilename;

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
         process.env.NEXT_PUBLIC_URL +
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

apirouter.post('/shorter', async (req: Request, res: Response) => {
   const { url } = req.body;

   const uploadKey: any = getuploadkey(req);
   const shorterSetting = await prisma.setting.findUnique({
      where: {
         name: 'publicShorter',
      },
   });

   if (!shorterSetting) {
      return badrequest(res, 'Public shorter setting not found');
   }

   const publicShorter = shorterSetting.value === 'true';

   let user = null;

   if (!publicShorter) {
      if (!(await validateUploadKey(uploadKey as string))) {
         return invaliduploadkey(res);
      }
   }

   if (uploadKey) {
      user = await prisma.user.findUnique({
         where: {
            key: uploadKey,
         },
      });
   }

   if (user) {
      if (!user) return badrequest(res, 'User not found');
      const perms = permissionsMap(user.permissions);
      if (!perms.shorter) return missingpermissions(res, 'shorter');
   }

   if (!validateURL(url)) {
      res.statusCode = 400;
      res.statusMessage = 'Bad Request | Invalid URL';
      return res.end();
   }

   const short = generateRandomString(5);
   await prisma.shorter.create({
      data: {
         name: short,
         url,
         createdAt: new Date(),
         ownerId: user ? user.id : null,
      },
   });

   const shortedURL = `${process.env.NEXT_PUBLIC_URL}/l/${short}`;

   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   return res.send(shortedURL);
});

apirouter.get('/links/:link', async (req: Request, res: Response) => {
   const { link } = req.params;

   if (!link) return res.status(400).json({ error: 'No link provided' });
   const shortedURL = await prisma.shorter.findUnique({
      where: {
         name: link,
      },
   });

   if (!shortedURL) {
      return res.status(404).json({ error: 'Link not found' });
   } else {
      await prisma.shorter.update({
         where: {
            name: link,
         },
         data: {
            views: shortedURL.views + 1,
         },
      });
      const url = shortedURL.url;
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
         shortedLink: link,
         url,
      });
   }
});

apirouter.get('/settings', async (req: Request, res: Response) => {
   const settings = await prisma.setting.findMany();
   const finalSettings: Setting[] = [];
   settings.forEach((setting) => {
      finalSettings.push({
         name: setting.name,
         value: setting.value,
         type: setting.type as any,
         info: setting.info,
      });
   });
   return res.status(200).json(settings);
});

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

function sendNotification({
   path,
   shortname,
   originalFilename,
   mimetype,
   username,
}: {
   path: string;
   shortname: string;
   originalFilename: string;
   mimetype: string;
   username: string;
}) {
   if (
      !process.env.DISCORD_EMBED_WEBHOOK_ENABLED ||
      !process.env.DISCORD_EMBED_WEBHOOK_URL ||
      !process.env.DISCORD_EMBED_WEBHOOK_TITLE ||
      !process.env.DISCORD_EMBED_WEBHOOK_DESCRIPTION ||
      !process.env.DISCORD_EMBED_WEBHOOK_COLOR
   )
      return;
   axiosClient
      .post(process.env.DISCORD_EMBED_WEBHOOK_URL, {
         embeds: [
            new Embed(
               0,
               process.env.DISCORD_EMBED_WEBHOOK_TITLE,
               parseInt(process.env.DISCORD_EMBED_WEBHOOK_COLOR),
               process.env.DISCORD_EMBED_WEBHOOK_DESCRIPTION.replace(
                  '{originalfilename}',
                  originalFilename,
               )
                  .replace('{shortname}', shortname)
                  .replace(
                     '{shortURL}',
                     process.env.NEXT_PUBLIC_URL + '/' + shortname,
                  )
                  .replace('{path}', path)
                  .replace('{mimetype}', mimetype)
                  .replace('{username}', username),
            ).build(),
         ],
      })
      .catch((err) => {
         new ConsoleLogger(
            'Upload notify failed with status code ' + err.statusCode,
         ).error();
      });
}

function uploadFile({
   dir,
   newFilePath,
   buffer,
   shortname,
   originalFilename,
   mimetype,
   extension,
   username,
   type,
   zip,
}: {
   dir: string;
   newFilePath: string;
   buffer: Buffer;
   shortname: string;
   originalFilename: string;
   mimetype: string;
   extension: string;
   username: string;
   type: 'image' | 'video' | 'audio' | 'data';
   zip?: boolean;
}): void {
   checkIfDirExists(dir);
   saveFile(newFilePath, buffer);
   sendNotification({
      mimetype,
      originalFilename,
      path: newFilePath,
      shortname,
      username,
   });
   if (zip) {
      const zip = new AdmZip();
      zip.addLocalFile(newFilePath);
      zip.writeZip(newFilePath + '.zip');
      fs.unlinkSync(newFilePath);
      newFilePath = newFilePath + '.zip';
   }

   return;
}

export default apirouter;
