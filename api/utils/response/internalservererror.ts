import { Response } from 'express';

export default function internalservererror(res: Response) {
   res.statusCode = 500;
   res.statusMessage = 'Internal Server Error';
   return res.json({
      status: 500,
      error: 'Internal Server Error',
   });
}
