import { validateUploadKey } from '../../../api/uploadKey';
import express from 'express';
import { Request, Response } from 'express';
import invaliduploadkey from '../../../api/utils/response/invaliduploadkey';
import { generateRandomString } from '../../../utils/generateRandomString';
import badrequest from '../../../api/utils/response/badrequest';
import prisma from '../../../prisma/client';

const authrouter = express.Router();

authrouter.post('/login', async (req: Request, res: Response) => {
   const { uploadKey } = req.body;
   if (!(await validateUploadKey(uploadKey || '')))
      return invaliduploadkey(res);

   const user = await prisma.user.findUnique({
      where: {
         key: uploadKey || '',
      },
   });

   if (!user) return badrequest(res, 'User not found');

   if (user.key === 'changeme' && user.username === 'default') {
      const newuploadkey = generateRandomString(35);
      await prisma.user.update({
         where: {
            key: uploadKey as string,
         },
         data: {
            key: newuploadkey,
         },
      });

      res.statusCode = 200;
      res.statusMessage = 'OK';
      return res.status(200).json({
         status: 200,
         success: true,
         uploadKey: newuploadkey,
         updated: true,
      });
   }

   res.statusCode === 200;
   res.statusMessage = 'OK';
   return res.send({
      status: 200,
      success: true,
      uploadKey,
   });
});

authrouter.get('/validateuploadkey', async (req: Request, res: Response) => {
   const uploadKey: any =
      req.cookies.get('upload_key') ||
      req.headers['authorization'] ||
      req.body.upload_key;

   const valide = await validateUploadKey(uploadKey);
   res.statusCode === 200;
   res.statusMessage = 'OK';
   return res.send({
      success: true,
      upload_key: uploadKey,
      valide,
   });
});

export default authrouter;
