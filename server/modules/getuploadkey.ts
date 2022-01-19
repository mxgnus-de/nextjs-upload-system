import { Request } from 'express';

export default function getuploadkey(req: Request): string | undefined {
   return (
      req.cookies.get('upload_key') ||
      req.headers['authorization'] ||
      req.body.upload_key
   );
}
