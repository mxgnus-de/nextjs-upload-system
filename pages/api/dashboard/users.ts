import { generateRandomString } from 'utils/generateRandomString';
import invaliduploadkey from 'api/utils/invaliduploadkey';
import methodnotallowed from 'api/utils/methodnotallowed';
import notfound from 'api/utils/notfound';
import { validateUploadKey } from 'api/uploadKey';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { userSQL } from 'api/db/mysql';

export const config = {
   api: {
      bodyParser: true,
   },
};

export default async function users(req: NextApiRequest, res: NextApiResponse) {
   const cookies = new Cookies(req, res);
   const uploadKey = cookies.get('upload_key') || req.headers['authorization'];
   if (!(await validateUploadKey(uploadKey as string)))
      return invaliduploadkey(res);

   if (req.method === 'GET') {
      const users = await userSQL.getAllUsers();
      return res.status(200).json(users);
   } else if (req.method === 'DELETE') {
      const { upload_key } = req.query;
      const user = await userSQL.getUser(upload_key as string);
      if (!upload_key || user.length === 0) {
         return notfound(res);
      }
      if (users.length - 1 === 0) {
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
   } else if (req.method === 'PUT') {
      const { action } = req.query;
      if (action === 'change') {
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
      }
   } else if (req.method === 'POST') {
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
   } else {
      return methodnotallowed(res);
   }
}
