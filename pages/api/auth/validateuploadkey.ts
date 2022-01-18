import { validateUploadKey } from 'api/uploadKey';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function valideuploadkey(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   if (req.method === 'GET') {
      const cookies = new Cookies(req, res);
      const uploadKey: any =
         cookies.get('upload_key') ||
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
   } else {
      return methodnotallowed(res);
   }
}
