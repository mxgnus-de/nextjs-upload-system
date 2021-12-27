import invaliduploadkey from 'api/utils/invaliduploadkey';
import methodnotallowed from 'api/utils/methodnotallowed';
import { validateUploadKey } from 'api/uploadKey';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function login(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { uploadKey } = req.body;
      if (!(await validateUploadKey(uploadKey || '')))
         return invaliduploadkey(res);

      res.statusCode === 200;
      res.statusMessage = 'OK';
      return res.send({
         success: true,
         uploadKey,
      });
   } else {
      return methodnotallowed(res);
   }
}
