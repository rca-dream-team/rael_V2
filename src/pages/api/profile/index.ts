import { getRequestUser } from '@/lib/api-middlewares';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      try {
         const user_type = (req.query.user_type as string) ?? req.cookies.user_type;
         const user = await getRequestUser(req, res, user_type);
         if (!user) {
            return res.json({ message: 'Unauthorized' });
         }
         res.json({ data: user, message: 'Profile request' });
      } catch (error) {
         //console.log('error', error);
         res.status(400).json({ message: 'Error getting profile request' });
      }
   }
}
