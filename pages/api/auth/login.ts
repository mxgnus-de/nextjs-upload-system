import invaliduploadkey from 'api/utils/invaliduploadkey';
import methodnotallowed from 'api/utils/methodnotallowed';
import validateUploadKey from 'api/validateUploadKey';
import { NextApiRequest, NextApiResponse } from 'next';
export default function login(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { uploadKey } = req.body;
      if (!validateUploadKey(uploadKey || '')) return invaliduploadkey(res);

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
