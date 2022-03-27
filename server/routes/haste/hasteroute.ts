import badrequest from '../../../api/utils/response/badrequest';
import { Request, Response, Router } from 'express';
import { generateRandomString } from '../../../utils/generateRandomString';
import internalservererror from '../../../api/utils/response/internalservererror';
import { server } from '../../../config/api';
import getuploadkey from '../../../server/modules/getuploadkey';
import { validateUploadKey } from '../../../api/uploadKey';
import invaliduploadkey from '../../../api/utils/response/invaliduploadkey';
import flourite from 'flourite';
import { PrismaClient } from '@prisma/client';
import { permissionsMap } from '../../../utils/permissions';
import missingpermissions from '../../../api/utils/response/missingpermissions';

const prisma = new PrismaClient();
const hasterouter = Router();

hasterouter.post('/new', async (req: Request, res: Response) => {
   const uploadKey = getuploadkey(req);
   const hasteSetting = await prisma.setting.findUnique({
      where: {
         name: 'publicHaste',
      },
   });
   if (!hasteSetting) return badrequest(res);
   const publicHaste = hasteSetting.value === 'true';

   let user = null;

   if (!publicHaste) {
      if (!(await validateUploadKey(uploadKey as string))) {
         return invaliduploadkey(res);
      }
   }

   if (uploadKey) {
      user = await prisma.user.findUnique({
         where: {
            key: uploadKey,
         },
      });
   }

   if (user) {
      const perms = permissionsMap(user.permissions);
      if (!perms.haste) return missingpermissions(res, 'haste');
   }

   let error = false;
   const { haste } = req.body;
   if (!haste) return badrequest(res);

   const maxHasteLength = await prisma.setting.findUnique({
      where: {
         name: 'maxHasteLength',
      },
   });
   if (!maxHasteLength) return badrequest(res);

   if (haste.length > Number(maxHasteLength.value)) {
      return res.status(400).json({
         status: 400,
         error: 'Haste is too long',
         message: 'Haste is too long',
      });
   }
   const newhasteID = generateRandomString(6);
   let language: null | string = flourite(haste).language.toLowerCase();
   if (language === 'unknown') language = null;
   await prisma.haste
      .create({
         data: {
            id: newhasteID,
            haste: haste,
            language: language,
            createdAt: new Date(),
            ownerId: user ? user.id : null,
         },
      })
      .catch((err) => {
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
   const haste = await prisma.haste
      .findUnique({
         where: {
            id: hasteID,
         },
      })
      .catch((err) => {
         error = true;
         badrequest(res);
         return;
      });
   if (error) return;
   if (!haste) return badrequest(res);
   return res.status(200).json({
      status: 200,
      haste: haste,
   });
});

hasterouter.get('/:hasteID/raw', async (req, res) => {
   const { hasteID } = req.params;
   const haste = await prisma.haste.findUnique({
      where: {
         id: hasteID,
      },
   });
   if (!haste) {
      return res.status(404).json({
         status: 404,
         error: 'Not Found',
      });
   }
   res.setHeader('Content-Type', 'text/plain');
   return res.status(200).send(haste.haste);
});

hasterouter.get('/:hasteID/json', async (req, res) => {
   const { hasteID } = req.params;
   const haste = await prisma.haste.findUnique({
      where: {
         id: hasteID,
      },
   });
   if (!haste)
      return res.status(404).json({
         status: 404,
         error: 'Not Found',
      });
   return res.status(200).json({
      status: 200,
      haste: {
         id: haste.id,
         haste: haste.haste,
         language: haste.language,
      },
   });
});

export default hasterouter;
