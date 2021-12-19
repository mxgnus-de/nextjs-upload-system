import { NextApiResponse } from 'next';
export default function methodnotallowed(response: NextApiResponse) {
   response.statusCode = 405;
   response.statusMessage = 'Method Not Allowed';
   return response.json({
      status: 405,
      error: 'Method not allowed',
   });
}
