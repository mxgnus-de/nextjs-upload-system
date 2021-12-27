import { NextApiRequest, NextApiResponse } from 'next';
import { shortSQL } from 'api/db/mysql';
import { server } from 'config/api';
import { generateRandomString } from 'utils/generateRandomString';
import { validateURL } from 'utils/validator';
import Cookies from 'cookies';
import methodnotallowed from 'api/utils/methodnotallowed';
import { validateUploadKey } from 'api/uploadKey';
import invaliduploadkey from 'api/utils/invaliduploadkey';

export const config = {
   api: {
      bodyParser: true,
   },
};

export default async function post(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { url } = req.body;
      const cookies = new Cookies(req, res);
      const uploadKey = cookies.get('upload_key') || req.body.upload_key;

      if (!(await validateUploadKey(uploadKey || '')))
         return invaliduploadkey(res);
      if (!validateURL(url)) {
         res.statusCode = 400;
         res.statusMessage = 'Bad Request | Invalid URL';
         return res.end();
      }

      const short = generateRandomString(6);
      await shortSQL.createNewShortURL(short, url);
      const shortedURL = `${server}/links/${short}`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.send(shortedURL);
   } else {
      return methodnotallowed(res);
   }
}
