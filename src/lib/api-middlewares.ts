import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { sanityClient } from '@/sanity/sanity.client';
import { profileRequestFields } from '@/sanity/queries/requests';

export const getRequestUser = async (req: NextApiRequest, res: NextApiResponse, user_type?: string) => {
   const token = req.cookies.rael_token;
   if (!token) {
      return res.json({ message: 'Unauthorized' });
   }
   const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
   //console.log('decoded', decoded);
   if (!decoded) {
      return res.json({ message: 'Unauthorized' });
   }
   const user = await sanityClient.fetch(
      `*[_type == '${user_type ?? 'student'}' && email == $email][0]{${profileRequestFields}}`,
      {
         email: decoded.email,
      },
   );
   return user;
};
