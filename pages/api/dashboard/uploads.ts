import { fileSQL } from 'api/db/mysql';
import invaliduploadkey from 'api/utils/response/invaliduploadkey';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import notfound from 'api/utils/response/notfound';
import { validateUploadKey } from 'api/uploadKey';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export const config = {
   api: {
      bodyParser: true,
   },
};

export default async function uploads(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const cookies = new Cookies(req, res);
   const uploadKey = cookies.get('upload_key') || req.headers['authorization'];

   if (!(await validateUploadKey(uploadKey as string)))
      return invaliduploadkey(res);

   if (req.method === 'GET') {
      const uploads = await fileSQL.selectAllFiles();
      return res.status(200).json(uploads);
   } else if (req.method === 'DELETE') {
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
   } else {
      return methodnotallowed(res);
   }
}
