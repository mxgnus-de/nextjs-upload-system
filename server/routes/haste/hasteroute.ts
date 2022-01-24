import { hasteSQL } from '../../../api/db/mysql';
import badrequest from '../../../api/utils/response/badrequest';
import { Request, Response, Router } from 'express';
import { generateRandomString } from '../../../utils/generateRandomString';
import isValidUser from '../../middleware/isValidUser';
import internalservererror from '../../../api/utils/response/internalservererror';
import { server } from 'config/api';

const hasterouter = Router();

hasterouter.post('/new', isValidUser, async (req: Request, res: Response) => {
   const { haste } = req.body;
   if (!haste) badrequest(res);
   const newhasteID = generateRandomString(15);
   await hasteSQL.createHaste(newhasteID, haste).catch((err) => {
      return internalservererror(res);
   });
   return res.status(200).json({
      status: 200,
      hasteID: newhasteID,
   });
});

hasterouter.get('/:hasteID', async (req: Request, res: Response) => {
   const { hasteID } = req.params;
   if (!hasteID) badrequest(res);
   const haste = await hasteSQL.getHaste(hasteID).catch((err) => {
      return badrequest(res);
   });
   if (!haste || haste.length === 0) badrequest(res);
   return res.status(200).json({
      status: 200,
      haste: haste[0],
      url: server + '/haste/' + hasteID,
   });
});

export default hasterouter;
