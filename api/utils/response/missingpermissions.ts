import { Response } from 'express';

export default function missingpermissions(res: Response, permission: string) {
   res.statusCode = 403;
   res.statusMessage = `Missing permissions: ${permission}`;
   return res.json({
      status: 403,
      error: `Missing permissions: ${permission}`,
   });
}
