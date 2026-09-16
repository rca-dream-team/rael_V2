import { getRequestUser } from '@/lib/api-middlewares';
import { fetchProfileRequest } from '@/sanity/queries/requests';
import Response from '@/types/response';
import { requestProfile } from '@/utils/funcs/fetch';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'PUT') {
      try {
         const { request, requester } = req.body;
         if (!request || !requester) {
            return res.status(400).json({ message: 'Enter all required parameters' });
         }
         if (!request.promotion) {
            return res.status(400).json({ message: 'Enter promotion' });
         }
         const user = await getRequestUser(req, res);
         if (!user) {
            return res.status(400).json({ message: 'Unauthorized' });
         }
         const data = await requestProfile(request, requester);
         res.json({ data });
      } catch (error: any) {
         //console.log('error', error);
         res.status(400).json(new Response(null, error, 'Error requesting profile'));
      }
   }
   if (req.method === 'GET') {
      try {
         const token = req.cookies.rael_token;
         if (!token) {
            return res.json({ message: 'Unauthorized' });
         }
         const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
         //console.log('decoded', decoded);
         if (!decoded) {
            return res.json({ message: 'Unauthorized' });
         }
         const existingRequest = await fetchProfileRequest(decoded.email);
         res.json({ data: existingRequest, message: 'Profile request' });
      } catch (error: any) {
         //console.log('error', error);
         res.status(400).json(new Response(null, error, 'Error getting profile request'));
      }
   }
}
