import { NextApiResponse } from 'next';
export default function notfound(response: NextApiResponse) {
   response.statusCode = 404;
   response.statusMessage = 'Not found | Source is not available';
   return response.json({
      status: 404,
      error: 'Not found | Source is not available',
   });
}
