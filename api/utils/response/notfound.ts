import { Response } from 'express';

export default function notfound(response: Response) {
   response.statusCode = 404;
   response.statusMessage = 'Not found | Source is not available';
   return response.json({
      status: 404,
      error: 'Not found | Source is not available',
   });
}
