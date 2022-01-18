import { isVersionUpToDate } from '../../../api/utils/github';
import { githubrepourl } from '../../../config/github';
import { Router, Response, Request } from 'express';
import Notification from '../../../types/Notification';
import { fileSQL, settingsSQL, shortSQL, userSQL } from '../../../api/db/mysql';
import { Settings } from '../../../types/Dashboard';
import badrequest from '../../../api/utils/response/badrequest';
import notfound from '../../../api/utils/response/notfound';
import fs from 'fs';
import { generateRandomString } from '../../../utils/generateRandomString';

const dashboardrouter = Router();

dashboardrouter.get('/notifications', async (req, res) => {
   const isUpToDate = await isVersionUpToDate();
   const notificationsArray: Notification[] = [
      {
         show: !isUpToDate,
         message:
            'There is a newer version of the program\nSee: ' + githubrepourl,
         name: 'update',
         url: githubrepourl,
      },
   ];
   return res.status(200).json({
      notifications: notificationsArray,
   });
});

dashboardrouter.get('/settings', async (req, res) => {
   const settings = await settingsSQL.getAllSettings();
   const finalSettings: Settings[] = [];
   settings.forEach((setting) => {
      finalSettings.push({
         name: setting.name,
         value: setting.value,
      });
   });
   return res.status(200).json(settings);
});

dashboardrouter.put('/settings', async (req, res) => {
   const action = req.query.action as string;
   const name = req.query.name as string;

   if (!action || !name) return badrequest(res);

   const settingSQL = await settingsSQL.getSetting(name || '');

   if (settingSQL.length === 0) return badrequest(res);
   const currentValue = settingSQL[0].value === 'true';

   if (action === 'toggle') {
      await settingsSQL.updateSetting(name, currentValue ? 'false' : 'true');
   }

   const newSettings: Settings[] = [];
   const settings = await settingsSQL.getAllSettings();
   settings.forEach((setting) => {
      newSettings.push({
         name: setting.name,
         value: setting.value,
      });
   });

   return res.status(200).json(newSettings);
});

dashboardrouter.get('/shorts', async (req: Request, res: Response) => {
   const shortedURLs = await shortSQL.selectAllShortedURLs();
   return res.status(200).json(shortedURLs);
});

dashboardrouter.delete('/shorts', async (req: Request, res: Response) => {
   const { shorturl } = req.query;
   const shortURL = await shortSQL.selectShortedURL(shorturl as string);
   if (!shorturl || shortURL.length === 0) {
      return notfound(res);
   }
   await shortSQL.deleteShortURL(shorturl as string);
   res.statusCode = 200;
   res.statusMessage = 'ShortURL deleted';
   return res.json({
      status: 200,
      message: 'ShortURL deleted',
   });
});

dashboardrouter.get('/uploads', async (req: Request, res: Response) => {
   const uploads = await fileSQL.selectAllFiles();
   return res.status(200).json(uploads);
});

dashboardrouter.delete('/uploads', async (req: Request, res: Response) => {
   const { filename } = req.query;
   const file = await fileSQL.selectFile(filename as string);
   if (!filename || file.length === 0) {
      return notfound(res);
   }
   await fileSQL.deleteFile(filename as string);
   fs.unlinkSync(file[0].path);
   res.statusCode = 200;
   res.statusMessage = 'File deleted';
   return res.json({
      status: 200,
      message: 'File deleted',
   });
});

dashboardrouter.get('/users', async (req: Request, res: Response) => {
   const users = await userSQL.getAllUsers();
   return res.status(200).json(users);
});

dashboardrouter.delete('/users', async (req: Request, res: Response) => {
   const { upload_key } = req.query;
   const user = await userSQL.getUser(upload_key as string);
   const allUsers = await userSQL.getAllUsers();
   if (!upload_key || user.length === 0) {
      return notfound(res);
   }
   if (allUsers.length - 1 === 0) {
      res.statusCode = 403;
      res.statusMessage = 'Cannot delete last user';
      return res.json({
         status: 403,
         message: 'Cannot delete last user',
      });
   }
   await userSQL.deleteUser(upload_key as string);
   res.statusCode = 200;
   res.statusMessage = 'User deleted';
   return res.json({
      status: 200,
      message: 'User deleted',
   });
});

dashboardrouter.put('/users', async (req: Request, res: Response) => {
   const uploadKey = req.cookies.get('upload_key');
   const { action } = req.query;
   if (action === 'changekey') {
      const newuploadkey = generateRandomString(100);
      const { upload_key } = req.query;
      const user = await userSQL.getUser(upload_key as string);
      if (!upload_key || user.length === 0) {
         return notfound(res);
      }
      await userSQL.updateUser(
         newuploadkey,
         user[0].username,
         upload_key as string,
      );
      res.statusCode = 200;
      res.statusMessage = 'User updated';
      return res.json({
         status: 200,
         message: 'User updated',
         newuploadkey,
      });
   } else if (action === 'changeusername') {
      const { newusername } = req.body;
      const user = await userSQL.getUser(uploadKey as string);
      if (!uploadKey || user.length === 0) {
         return notfound(res);
      }

      await userSQL.updateUser(uploadKey as string, newusername, user[0].key);
      res.statusCode = 200;
      res.statusMessage = 'User updated';
      return res.json({
         status: 200,
         message: 'User updated',
         newusername,
      });
   } else {
      return badrequest(res);
   }
});

dashboardrouter.post('/users', async (req: Request, res: Response) => {
   const { username } = req.body;
   const newuploadkey = generateRandomString(100);
   await userSQL.createNewUser(newuploadkey, username);
   res.statusCode = 200;
   res.statusMessage = 'User created';
   return res.json({
      status: 200,
      message: 'User created',
      uploadkey: newuploadkey,
      username,
   });
});

export default dashboardrouter;
