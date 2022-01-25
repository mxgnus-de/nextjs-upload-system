import { hasteSQL } from '../../../api/db/mysql';
import badrequest from '../../../api/utils/response/badrequest';
import { Request, Response, Router } from 'express';
import { generateRandomString } from '../../../utils/generateRandomString';
import isValidUser from '../../middleware/isValidUser';
import internalservererror from '../../../api/utils/response/internalservererror';
import { server } from '../../../config/api';

const hasterouter = Router();

hasterouter.post('/new', isValidUser, async (req: Request, res: Response) => {
   let error = false;
   const { haste } = req.body;
   if (!haste) return badrequest(res);
   const newhasteID = generateRandomString(15);
   await hasteSQL.createHaste(newhasteID, haste).catch((err) => {
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
      return badrequest(res);
   });
   if (error) return;
   if (!haste || haste.length === 0) return badrequest(res);
   return res.status(200).json({
      status: 200,
      haste: haste[0],
   });
});

export default hasterouter;
