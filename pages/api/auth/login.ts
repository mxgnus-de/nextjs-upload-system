import { generateRandomString } from 'utils/generateRandomString';
import invaliduploadkey from 'api/utils/response/invaliduploadkey';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import { validateUploadKey } from 'api/uploadKey';
import { NextApiRequest, NextApiResponse } from 'next';
import { userSQL } from 'api/db/mysql';
export default async function login(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { uploadKey } = req.body;
      if (!(await validateUploadKey(uploadKey || '')))
         return invaliduploadkey(res);

      const user = await userSQL.getUser(uploadKey);
      if (user.length !== 0) {
         if (user[0].key === 'changeme' && user[0].username === 'default') {
            const newuploadkey = generateRandomString(100);
            await userSQL.updateUser(
               newuploadkey,
               user[0].username,
               user[0].key,
            );

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
   } else {
      return methodnotallowed(res);
   }
}
