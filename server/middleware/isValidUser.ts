import { validateUploadKey } from '../../api/uploadKey';
import invaliduploadkey from '../../api/utils/response/invaliduploadkey';
import { NextFunction, Request, Response } from 'express';
import getuploadkey from '../modules/getuploadkey';

export default async function isValidUser(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   const uploadKey = getuploadkey(req);

   if (!(await validateUploadKey(uploadKey as string))) {
      return invaliduploadkey(res);
   } else {
      return next();
   }
}
