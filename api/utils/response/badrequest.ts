import { Response } from 'express';

export default function badrequest(res: Response) {
   res.statusCode = 400;
   res.statusMessage = 'Bad Request';
   return res.json({
      status: 400,
      error: 'Bad Request',
   });
}
