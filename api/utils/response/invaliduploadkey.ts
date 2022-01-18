import { Response } from 'express';

export default function invaliduploadkey(response: Response) {
   response.statusCode = 401;
   response.statusMessage = 'Unauthorized | Invalid upload key';
   return response.json({
      status: 401,
      error: 'Unauthorized | Invalid upload key',
   });
}
