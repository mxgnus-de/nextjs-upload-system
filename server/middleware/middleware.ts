import { Request, Response, NextFunction } from 'express';
import { validateUploadKey } from '../../api/uploadKey';

export async function middleware(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   const uploadKey = req.cookies.get('upload_key');

   const privatePages = ['/', '/shorter'];
   let blockedPage = false;
   privatePages.forEach((page) => {
      if (req.path === page) blockedPage = true;
   });
   if (req.path.startsWith('/dashboard')) blockedPage = true;
   const isValideUploadKey = await validateUploadKey(uploadKey);
   if (!isValideUploadKey && !req.path.startsWith('/login') && blockedPage) {
      return res.redirect('/login?redirect=' + req.path);
   }
   return next();
}
