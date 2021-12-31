import { settingsSQL } from 'api/db/mysql';
import { validateUploadKey } from 'api/uploadKey';
import badrequest from 'api/utils/response/badrequest';
import invaliduploadkey from 'api/utils/response/invaliduploadkey';
import methodnotallowed from 'api/utils/response/methodnotallowed';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { Settings } from 'types/Dashboard';

export default async function settings(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const cookies = new Cookies(req, res);
   const uploadKey = cookies.get('upload_key') || req.headers['authorization'];

   if (!(await validateUploadKey(uploadKey as string)))
      return invaliduploadkey(res);

   if (req.method === 'GET') {
      const settings = await settingsSQL.getAllSettings();
      const finalSettings: Settings[] = [];
      settings.forEach((setting) => {
         finalSettings.push({
            name: setting.name,
            value: setting.value,
         });
      });
      return res.status(200).json(settings);
   } else if (req.method === 'PUT') {
      const action = req.query.action as string;
      const name = req.query.name as string;

      if (!action || !name) return badrequest(res);

      const settingSQL = await settingsSQL.getSetting(name || '');

      if (settingSQL.length === 0) return badrequest(res);
      const currentValue = settingSQL[0].value === 'true';

      if (action === 'toggle') {
         await settingsSQL.updateSetting(name, currentValue ? 'false' : 'true');
      }

      const newSettings: Settings[] = [];
      const settings = await settingsSQL.getAllSettings();
      settings.forEach((setting) => {
         newSettings.push({
            name: setting.name,
            value: setting.value,
         });
      });

      return res.status(200).json(newSettings);
   } else {
      return methodnotallowed(res);
   }
}
