import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileSQL } from 'api/db/mysql';
import methodnotallowed from 'api/utils/methodnotallowed';

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
      const { uploadID, download } = req.query;

      if (!uploadID)
         return res.status(400).json({ error: 'No uploadID provided' });
      const file: any = await fileSQL.selectFile(uploadID as string);
      if (!file.length) {
         return res.status(404).json({ error: 'File not found' });
      } else {
         const mimetype = file[0].mimetype;
         const filePath = file[0].path;
         const originalFilename = file[0].originalfilename;

         if (!mimetype) {
            return res.status(400).json({ error: 'Invalid file type' });
         }

         const fileBuffer = fs.readFileSync(filePath);
         res.setHeader('Content-Type', mimetype);
         res.setHeader('Filename', originalFilename);
         if (download === 'true') {
            res.setHeader(
               'Content-Disposition',
               'attachment; filename="' + originalFilename + '"',
            );
         }

         return res.status(200).send(fileBuffer);
      }
   } else {
      return methodnotallowed(res);
   }
}
