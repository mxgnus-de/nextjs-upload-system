import { validateUploadKey } from 'api/uploadKey';
import { isVersionUpToDate } from 'api/utils/github';
import invaliduploadkey from 'api/utils/response/invaliduploadkey';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import { githubrepourl } from 'config/github';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import Notification from 'types/Notification';
export default async function notifications(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const cookies = new Cookies(req, res);
   const uploadKey = cookies.get('upload_key') || req.headers['authorization'];

   if (!(await validateUploadKey(uploadKey as string)))
      return invaliduploadkey(res);

   if (req.method === 'GET') {
      const isUpToDate = await isVersionUpToDate();
      const notificationsArray: Notification[] = [
         {
            show: !isUpToDate,
            message:
               'There is a newer version of the program\nSee: ' + githubrepourl,
            name: 'update',
            url: githubrepourl,
         },
      ];
      return res.status(200).json({
         notifications: notificationsArray,
      });
   } else {
      return methodnotallowed(res);
   }
}
