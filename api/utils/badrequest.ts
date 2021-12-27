import { NextApiResponse } from 'next';

export default function badrequest(res: NextApiResponse) {
   res.statusCode = 400;
   res.statusMessage = 'Bad Request';
   return res.json({
      status: 400,
      error: 'Bad Request',
   });
}
