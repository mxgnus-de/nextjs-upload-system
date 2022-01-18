import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileSQL } from 'api/db/mysql';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import mime from 'mime-types';
import { paths } from 'config/upload';
import { server } from 'config/api';

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
      const { uploadID } = req.query;

      if (!uploadID)
         return res.status(400).json({ error: 'No uploadID provided' });
      const file: any = await fileSQL.selectFile(uploadID as string);
      if (!file.length) {
         return res.status(404).json({ error: 'File not found' });
      } else {
         const mimetype: string = file[0].mimetype;
         const filePath: string = file[0].path;
         const originalFilename: string = file[0].originalfilename;

         if (!mimetype) {
            res.statusMessage = 'No mimetype provided';
            return res
               .status(400)
               .json({ status: 400, error: 'Invalid file type' });
         }

         const exist: boolean = fs.existsSync(filePath);
         if (!exist) {
            res.statusMessage = 'File not found';
            return res
               .status(404)
               .json({ status: 404, error: 'File not found' });
         }

         const file_url =
            server +
            '/uploads' +
            filePath
               .replace(paths.upload, '')
               .replaceAll('\\', '/')
               .replaceAll('//', '/');
         const resObj = {
            status: 200,
            mime_type: mimetype,
            original_filename: originalFilename,
            file_name: uploadID,
            file_extension: mime.extension(mimetype),
            file_path: file_url,
            file_path_name: file_url.split('/')[file_url.split('/').length - 1],
         };

         return res.status(200).json(resObj);
      }
   } else {
      return methodnotallowed(res);
   }
}
