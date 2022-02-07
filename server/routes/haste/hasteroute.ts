import { hasteSQL, settingsSQL } from '../../../api/db/mysql';
import badrequest from '../../../api/utils/response/badrequest';
import { Request, Response, Router } from 'express';
import { generateRandomString } from '../../../utils/generateRandomString';
import internalservererror from '../../../api/utils/response/internalservererror';
import { server } from '../../../config/api';
import getuploadkey from '../../../server/modules/getuploadkey';
import { validateUploadKey } from '../../../api/uploadKey';
import invaliduploadkey from '../../../api/utils/response/invaliduploadkey';
import flourite from 'flourite';
const hasterouter = Router();

hasterouter.post('/new', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req);
   const hasteSetting = await settingsSQL.getSetting('publicHaste');
   const publicHaste = hasteSetting[0].value === 'true';

   if (!publicHaste) {
      if (!(await validateUploadKey(uploadKey as string))) {
         return invaliduploadkey(res);
      }
   }

   let error = false;
   const { haste } = req.body;
   if (!haste) return badrequest(res);

   const maxHasteLength = await settingsSQL.getSetting('maxHasteLength');
   if (haste.length > Number(maxHasteLength[0].value)) {
      return res.status(400).json({
         status: 400,
         error: 'Haste is too long',
         message: 'Haste is too long',
      });
   }
   const newhasteID = generateRandomString(15);
   let language: null | string = flourite(haste).language.toLowerCase();
   if (language === 'unknown') language = null;
   await hasteSQL.createHaste(newhasteID, haste, language).catch((err) => {
      error = true;
      return internalservererror(res);
   });
   if (error) return;
   return res.status(200).json({
      status: 200,
      hasteID: newhasteID,
      url: server + '/haste/' + newhasteID,
   });
});

hasterouter.get('/:hasteID', async (req: Request, res: Response) => {
   let error = false;
   const { hasteID } = req.params;
   if (!hasteID) return badrequest(res);
   const haste = await hasteSQL.getHaste(hasteID).catch((err) => {
      error = true;
      badrequest(res);
      return;
   });
   if (error) return;
   if (!haste || haste?.length === 0) return badrequest(res);
   return res.status(200).json({
      status: 200,
      haste: haste[0],
   });
});

export default hasterouter;
