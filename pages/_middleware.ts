import validateUploadKey from 'api/validateUploadKey';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
   const cookies = req.cookies;
   const uploadKey = cookies['upload_key'];
   const privatePages = ['/', '/shorter'];
   let blockedPage = false;
   privatePages.forEach((page) => {
      if (req.page.name === page) blockedPage = true;
   });
   if (req.page.name?.startsWith('/dashboard')) blockedPage = true;
   if (
      !validateUploadKey(uploadKey) &&
      req.page.name !== '/login' &&
      blockedPage
   ) {
      return NextResponse.redirect('/login');
   }
   NextResponse.next();
}
