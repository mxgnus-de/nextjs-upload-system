import { Response } from 'express';

export default function methodnotallowed(response: Response) {
   response.statusCode = 405;
   response.statusMessage = 'Method Not Allowed';
   return response.json({
      status: 405,
      error: 'Method not allowed',
   });
}
