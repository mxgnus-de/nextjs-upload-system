import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { shortSQL } from 'api/db/mysql';
import methodnotallowed from 'api/utils/response/methodnotallowed';

export const config = {
   api: {
      bodyParser: false,
   },
};

export default async function get(
   req: NextApiRequest,
   res: NextApiResponse<any>,
) {
   if (req.method === 'GET') {
      const { link } = req.query;

      if (!link) return res.status(400).json({ error: 'No link provided' });
      const shortedURL: any = await shortSQL.selectShortedURL(link as string);
      if (!shortedURL.length) {
         return res.status(404).json({ error: 'File not found' });
      } else {
         const url = shortedURL[0].url;

         res.setHeader('Content-Type', 'application/json');
         return res.status(200).json({
            shortedLink: link,
            url,
         });
      }
   } else {
      return methodnotallowed(res);
   }
}
