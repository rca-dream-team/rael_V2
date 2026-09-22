import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { sanityClient } from '@/sanity/sanity.client';
import { profileRequestFields } from '@/sanity/queries/requests';
import { MOCK_PERSONAS, isMockAuthEnabled } from '@/lib/mock-auth';

export const getRequestUser = async (req: NextRequest, user_type?: string) => {
   try {
      const token = req.cookies.get('rael_token')?.value;
      if (!token) return null;

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      if (!decoded?.email) return null;

      // 1. Query Sanity CMS for user profile
      const user = await sanityClient.fetch(
         `*[_type == '${user_type ?? 'student'}' && email == $email][0]{${profileRequestFields}}`,
         { email: decoded.email }
      );

      if (user) return user;

      // 2. Fallback for Local Dev Mock Sessions
      if (isMockAuthEnabled() && decoded.email.endsWith('@rca.ac.rw')) {
         const personaKey = decoded.role === 'STAFF' ? 'staff' : 'student';
         const persona = MOCK_PERSONAS[personaKey];
         if (persona && persona.email === decoded.email) {
            return {
               _id: decoded.id || persona.id,
               names: `${persona.firstName} ${persona.lastName}`,
               email: persona.email,
               currentClass: persona.currentClass,
            };
         }
      }

      return null;
   } catch {
      return null;
   }
};
