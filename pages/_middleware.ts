import { settingsSQL } from 'api/db/mysql';
import { server } from 'config/api';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
   const cookies = req.cookies;
   const uploadKey = cookies['upload_key'];
   const privatePages = ['/', '/shorter', '/haste'];
   let blockedPage = false;
   privatePages.forEach((page) => {
      if (req.page.name === page) blockedPage = true;
   });

   const response = await fetch(`${server}/api/auth/validateuploadkey`, {
      method: 'GET',
      headers: {
         Authorization: uploadKey,
      },
   });
   const json = await response?.json().catch(() => {});
   const isValideUploadKey = json?.valide || false;

   if (req.page.name?.startsWith('/dashboard')) blockedPage = true;
   const settings = await fetch(`${server}/api/settings`, {
      method: 'GET',
   });

   const settingsJson: {
      name: string;
      value: 'true' | 'false';
   }[] = await settings?.json().catch(() => {});
   const publicHaste = settingsJson.find(
      (setting) => setting.name === 'publicHaste',
   );
   if (publicHaste?.value === 'true' && req.nextUrl.pathname === '/haste') {
      return NextResponse.next();
   }

   if (
      !isValideUploadKey &&
      !req.page.name?.startsWith('/login') &&
      blockedPage
   ) {
      return NextResponse.redirect('/login?redirect=' + req.page.name);
   }
   return NextResponse.next();
}
