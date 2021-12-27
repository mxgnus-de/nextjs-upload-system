import invaliduploadkey from 'api/utils/invaliduploadkey';
import methodnotallowed from 'api/utils/methodnotallowed';
import notfound from 'api/utils/notfound';
import { validateUploadKey } from 'api/uploadKey';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { shortSQL } from 'api/db/mysql';

export const config = {
   api: {
      bodyParser: true,
   },
};

export default async function shorts(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const cookies = new Cookies(req, res);
   const uploadKey = cookies.get('upload_key') || req.headers['authorization'];

   if (!(await validateUploadKey(uploadKey as string)))
      return invaliduploadkey(res);

   if (req.method === 'GET') {
      const shortedURLs = await shortSQL.selectAllShortedURLs();
      return res.status(200).json(shortedURLs);
   } else if (req.method === 'DELETE') {
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
   } else {
      return methodnotallowed(res);
   }
}
