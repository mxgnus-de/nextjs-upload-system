import { permissionsMap } from '../../../utils/permissions';
import { isVersionUpToDate } from '../../../api/utils/github';
import { githubrepourl } from '../../../config/github';
import { Router, Response, Request } from 'express';
import Notification from '../../../types/Notification';
import badrequest from '../../../api/utils/response/badrequest';
import notfound from '../../../api/utils/response/notfound';
import fs from 'fs';
import { generateRandomString } from '../../../utils/generateRandomString';
import {
   File,
   Haste,
   PrismaClient,
   Setting,
   Shorter,
   User,
} from '@prisma/client';
import { FileOwner, HasteOwner, ShorterOwner } from 'types/Dashboard';
import getuploadkey from '../../../server/modules/getuploadkey';
import missingpermissions from '../../../api/utils/response/missingpermissions';

const prisma = new PrismaClient();
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

dashboardrouter.put('/settings', async (req, res) => {
   const action = req.query.action as string;
   const name = req.query.name as string;
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (!perms.manage_settings)
      return missingpermissions(res, 'manage_settings');

   if (!action || !name) return badrequest(res);

   const settingSQL = await prisma.setting.findUnique({
      where: {
         name: name,
      },
   });

   if (!settingSQL) return badrequest(res);

   const currentValue = settingSQL.value;

   if (action === 'toggle') {
      await prisma.setting.update({
         where: {
            name: name,
         },
         data: {
            value: currentValue === 'true' ? 'false' : 'true',
         },
      });
   } else if (action === 'set') {
      const { value } = req.body;
      if (!value) return badrequest(res, 'No value provided');
      if (typeof value !== settingSQL.type) {
         return badrequest(res, 'Value type is not correct');
      }
      await prisma.setting.update({
         where: {
            name: name,
         },
         data: {
            value: value.toString(),
         },
      });
   } else {
      return badrequest(res, 'Invalid action');
   }

   const newSettings: Setting[] = [];
   const settings = await prisma.setting.findMany();
   settings.forEach((setting) => {
      newSettings.push({
         name: setting.name,
         value: setting.value,
         type: setting.type as any,
         info: setting.info,
      });
   });

   return res.status(200).json(newSettings);
});

dashboardrouter.get('/shorts', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   let shortedURLs: Shorter[] = [];
   if (perms.manage_all_uploads) {
      shortedURLs = await prisma.shorter.findMany();
   } else {
      shortedURLs = await prisma.shorter.findMany({
         where: {
            owner: {
               id: user.id,
            },
         },
      });
   }
   const finalShortedURLs: ShorterOwner[] = [];
   const cachedUsers = new Map<string, User>();
   for (const shortedURL of shortedURLs) {
      if (!shortedURL.ownerId) {
         finalShortedURLs.push({ ...shortedURL, ownerName: null });
         continue;
      }
      const cachedUser = cachedUsers.get(shortedURL.ownerId);
      if (cachedUser) {
         finalShortedURLs.push({
            ...shortedURL,
            ownerName: cachedUser.username,
         });
         continue;
      } else {
         const owner = await prisma.user.findUnique({
            where: {
               id: shortedURL.ownerId,
            },
         });
         if (!owner) {
            finalShortedURLs.push({ ...shortedURL, ownerName: null });
         } else {
            cachedUsers.set(owner.id, owner);
            finalShortedURLs.push({ ...shortedURL, ownerName: owner.username });
         }
      }
   }
   return res.status(200).json(finalShortedURLs);
});

dashboardrouter.delete('/shorts', async (req: Request, res: Response) => {
   const { shorturl } = req.query;
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   let shortURL = null;
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (perms.manage_all_uploads) {
      shortURL = await prisma.shorter.findUnique({
         where: {
            name: (shorturl as string) || '',
         },
      });
   } else {
      shortURL = await prisma.shorter.findUnique({
         where: {
            name: (shorturl as string) || '',
         },
      });

      shortURL = shortURL && shortURL.ownerId === user.id ? shortURL : null;
   }
   if (!shorturl) return badrequest(res);
   if (!shortURL) {
      return notfound(res);
   }
   await prisma.shorter.delete({
      where: {
         name: shortURL.name,
      },
   });
   res.statusCode = 200;
   res.statusMessage = 'ShortURL deleted';
   return res.json({
      status: 200,
      message: 'ShortURL deleted',
   });
});

dashboardrouter.get('/uploads', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   let uploads: File[] = [];
   const perms = permissionsMap(user.permissions);
   if (perms.manage_all_uploads) {
      uploads = await prisma.file.findMany();
   } else {
      uploads = await prisma.file.findMany({
         where: {
            owner: {
               id: user.id,
            },
         },
      });
   }

   const finalUploads: FileOwner[] = [];
   const cachedUsers = new Map<string, User>();
   for (const upload of uploads) {
      if (!upload.ownerId) {
         finalUploads.push({ ...upload, ownerName: null });
         continue;
      }
      const cachedUser = cachedUsers.get(upload.ownerId);
      if (cachedUser) {
         finalUploads.push({ ...upload, ownerName: cachedUser.username });
         continue;
      } else {
         const owner = await prisma.user.findUnique({
            where: {
               id: upload.ownerId,
            },
         });
         if (!owner) {
            finalUploads.push({ ...upload, ownerName: null });
         } else {
            cachedUsers.set(owner.id, owner);
            finalUploads.push({ ...upload, ownerName: owner.username });
         }
      }
   }
   return res.status(200).json(finalUploads);
});

dashboardrouter.delete('/uploads', async (req: Request, res: Response) => {
   const { filename } = req.query;
   if (!filename) {
      return notfound(res);
   }
   const uploadKey = getuploadkey(req) as string;
   let file = null;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (perms.manage_all_uploads) {
      file = await prisma.file.findUnique({
         where: {
            name: (filename as string) || '',
         },
      });
   } else {
      file = await prisma.file.findUnique({
         where: {
            name: (filename as string) || '',
         },
      });
      file = file && file.ownerId === user.id ? file : null;
   }

   if (!file) {
      return notfound(res);
   }

   await prisma.file.delete({
      where: {
         name: filename as string,
      },
   });
   fs.unlinkSync(file.path);
   res.statusCode = 200;
   res.statusMessage = 'File deleted';
   return res.json({
      status: 200,
      message: 'File deleted',
   });
});

dashboardrouter.get('/users', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (!perms.manage_users) {
      return missingpermissions(res, 'manage_users');
   }
   const users = await prisma.user.findMany();

   return res.status(200).json(users);
});

dashboardrouter.delete('/users', async (req: Request, res: Response) => {
   const { key } = req.query;
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });

   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (!perms.manage_users) {
      return missingpermissions(res, 'manage_users');
   }

   if (!key) {
      return notfound(res);
   }
   const user2 = await prisma.user.findUnique({
      where: {
         key: (key as string) || '',
      },
   });

   if (!user2) {
      return notfound(res);
   }

   const allUsers = await prisma.user.findMany();

   if (allUsers.length - 1 === 0) {
      res.statusCode = 403;
      res.statusMessage = 'Cannot delete last user';
      return res.json({
         status: 403,
         message: 'Cannot delete last user',
      });
   }
   await prisma.user.delete({
      where: {
         key: key as string,
      },
   });
   res.statusCode = 200;
   res.statusMessage = 'User deleted';
   return res.json({
      status: 200,
      message: 'User deleted',
   });
});

dashboardrouter.put('/users', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req) as string;
   const { action } = req.query;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (!perms.manage_users) {
      return missingpermissions(res, 'manage_users');
   }

   if (!action) {
      return badrequest(res);
   }

   if (action === 'changekey') {
      const newuploadkey = generateRandomString(100);
      const { key } = req.query;
      const user = await prisma.user.findUnique({
         where: {
            key: (key as string) || '',
         },
      });
      if (!key || !user) {
         return notfound(res);
      }

      await prisma.user.update({
         where: {
            key: key as string,
         },
         data: {
            key: newuploadkey,
         },
      });

      res.statusCode = 200;
      res.statusMessage = 'User updated';
      return res.json({
         status: 200,
         message: 'User updated',
         newuploadkey,
      });
   } else if (action === 'changeusername') {
      const { key } = req.query;
      const { newusername } = req.body;

      if (!newusername) {
         return badrequest(res);
      }

      const user = await prisma.user.findUnique({
         where: {
            key: (key as string) || '',
         },
      });

      if (!user) {
         return notfound(res);
      }

      await prisma.user.update({
         where: {
            key: key as string,
         },
         data: {
            username: newusername,
         },
      });

      res.statusCode = 200;
      res.statusMessage = 'User updated';
      return res.json({
         status: 200,
         message: 'User updated',
         newusername,
      });
   } else if (action === 'changepermissions') {
      const { permissions } = req.body;
      const { key } = req.query;

      if (!permissions || !key) {
         return badrequest(res);
      }
      if (typeof permissions !== 'string') {
         return badrequest(res, 'permissions must be a string');
      }
      const user = await prisma.user.findUnique({
         where: {
            key: (key as string) || '',
         },
      });

      if (!user) {
         return notfound(res);
      }

      await prisma.user.update({
         where: {
            key: key as string,
         },
         data: {
            permissions: permissions as string,
         },
      });

      const users = await prisma.user.findMany();

      res.statusCode = 200;
      res.statusMessage = 'User updated';
      return res.json({
         status: 200,
         message: 'User updated',
         permissions,
         users,
      });
   } else {
      return badrequest(res);
   }
});

dashboardrouter.post('/users', async (req: Request, res: Response) => {
   const { username } = req.body;
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (!perms.manage_users) {
      return missingpermissions(res, 'manage_users');
   }
   const newuploadkey = generateRandomString(100);
   if (!username) {
      return badrequest(res);
   }
   await prisma.user.create({
      data: {
         username,
         key: newuploadkey,
         createdAt: new Date(),
      },
   });

   res.statusCode = 200;
   res.statusMessage = 'User created';
   return res.json({
      status: 200,
      message: 'User created',
      uploadkey: newuploadkey,
      username,
   });
});

dashboardrouter.get('/haste', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req) as string;
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   let hastes: Haste[] = [];
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (perms.manage_all_uploads) {
      hastes = await prisma.haste.findMany();
   } else {
      hastes = await prisma.haste.findMany({
         where: {
            owner: {
               id: user.id,
            },
         },
      });
   }
   const finalHastes: HasteOwner[] = [];
   const cachedUsers = new Map<string, User>();
   for (const haste of hastes) {
      if (!haste.ownerId) {
         finalHastes.push({ ...haste, ownerName: null });
         continue;
      }
      const cachedUser = cachedUsers.get(haste.ownerId);
      if (cachedUser) {
         finalHastes.push({ ...haste, ownerName: cachedUser.username });
         continue;
      } else {
         const owner = await prisma.user.findUnique({
            where: {
               id: haste.ownerId,
            },
         });
         if (!owner) {
            finalHastes.push({ ...haste, ownerName: null });
         } else {
            cachedUsers.set(owner.id, owner);
            finalHastes.push({ ...haste, ownerName: owner.username });
         }
      }
   }
   return res.status(200).json(finalHastes);
});

dashboardrouter.delete('/haste', async (req: Request, res: Response) => {
   const { id } = req.query;
   const uploadKey = getuploadkey(req) as string;
   if (!id) {
      return badrequest(res);
   }
   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey,
      },
   });
   let haste = null;
   if (!user) return badrequest(res);
   const perms = permissionsMap(user.permissions);
   if (perms.manage_all_uploads) {
      haste = await prisma.haste.findUnique({
         where: {
            id: (id as string) || '',
         },
      });
   } else {
      haste = await prisma.haste.findUnique({
         where: {
            id: (id as string) || '',
         },
      });
      haste = haste && haste.ownerId === user.id ? haste : null;
   }

   if (!haste) {
      return notfound(res);
   }

   await prisma.haste.delete({
      where: {
         id: id as string,
      },
   });

   res.statusCode = 200;
   res.statusMessage = 'Haste deleted';
   return res.json({
      status: 200,
      message: 'Haste deleted',
   });
});

export default dashboardrouter;
