import { validateUploadKey } from '../../api/uploadKey';
import invaliduploadkey from '../../api/utils/response/invaliduploadkey';
import { NextFunction, Request, Response } from 'express';

export default async function isValidUser(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   const uploadKey =
      req.cookies.get('upload_key') ||
      req.headers['authorization'] ||
      req.body.upload_key;

   if (!(await validateUploadKey(uploadKey as string))) {
      return invaliduploadkey(res);
   } else {
      return next();
   }
}
