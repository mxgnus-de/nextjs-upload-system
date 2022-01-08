import { server } from 'config/api';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
   const cookies = req.cookies;
   const uploadKey = cookies['upload_key'];
   const privatePages = ['/', '/shorter'];
   let blockedPage = false;
   privatePages.forEach((page) => {
      if (req.page.name === page) blockedPage = true;
   });
   const response = await fetch(`${server}/api/auth/validateuploadkey`, {
      method: 'GET',
      headers: {
         Authorization: uploadKey,
      },
   }).catch();
   const json = await response.json();
   const isValideUploadKey = json.valide;

   if (req.page.name?.startsWith('/dashboard')) blockedPage = true;
   if (
      !isValideUploadKey &&
      !req.page.name?.startsWith('/login') &&
      blockedPage
   ) {
      return NextResponse.redirect('/login?redirect=' + req.page.name);
   }
   NextResponse.next();
}
