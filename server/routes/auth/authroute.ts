import { validateUploadKey } from '../../../api/uploadKey';
import express from 'express';
import { Request, Response } from 'express';
import invaliduploadkey from '../../../api/utils/response/invaliduploadkey';
import { userSQL } from '../../../api/db/mysql';
import { generateRandomString } from '../../../utils/generateRandomString';

const authrouter = express.Router();

authrouter.post('/login', async (req: Request, res: Response) => {
   const { uploadKey } = req.body;
   if (!(await validateUploadKey(uploadKey || '')))
      return invaliduploadkey(res);

   const user = await userSQL.getUser(uploadKey);
   if (user.length !== 0) {
      if (user[0].key === 'changeme' && user[0].username === 'default') {
         const newuploadkey = generateRandomString(100);
         await userSQL.updateUser(newuploadkey, user[0].username, user[0].key);

         res.statusCode = 200;
         res.statusMessage = 'OK';
         return res.status(200).json({
            status: 200,
            success: true,
            uploadKey: newuploadkey,
            updated: true,
         });
      }
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
