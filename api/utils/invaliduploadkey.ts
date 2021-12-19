import { NextApiResponse } from 'next';
export default function invaliduploadkey(response: NextApiResponse) {
   response.statusCode = 401;
   response.statusMessage = 'Unauthorized | Invalid upload key';
   return response.json({
      status: 401,
      error: 'Unauthorized | Invalid upload key',
   });
}
