import { hasteSQL } from '../../api/db/mysql';
import { Router } from 'express';

const mainroute = Router();

// [GET] /haste/:hasteID/raw
mainroute.get('/haste/:hasteID/raw', async (req, res) => {
   const { hasteID } = req.params;
   const haste = await hasteSQL.getHaste(hasteID);
   if (!haste || haste.length === 0)
      return res.status(404).json({
         status: 404,
         error: 'Not Found',
      });
   res.setHeader('Content-Type', 'text/plain');
   return res.status(200).send(haste[0].haste);
});

// /haste/:hasteID/json
mainroute.get('/haste/:hasteID/json', async (req, res) => {
   const { hasteID } = req.params;
   const haste = await hasteSQL.getHaste(hasteID);
   if (!haste || haste.length === 0)
      return res.status(404).json({
         status: 404,
         error: 'Not Found',
      });
   return res.status(200).json({
      status: 200,
      haste: {
         id: haste[0].id,
         haste: haste[0].haste,
         language: haste[0].language,
      },
   });
});

export default mainroute;
