import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/sanity.client';
import Response from '@/types/response';
import { misApi } from '@/utils/axios.config';
import jwt from 'jsonwebtoken';
import { MOCK_PERSONAS, isMockAuthEnabled } from '@/lib/mock-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();

      // =========================================================================
      // 1. MOCK AUTH BYPASS (Local & Off-Campus Development)
      // =========================================================================
      if (body?.mock) {
         if (!isMockAuthEnabled()) {
            return NextResponse.json(
               { message: 'Mock authentication is disabled in this environment' },
               { status: 403 }
            );
         }

         const selectedRole: 'student' | 'staff' = body.role === 'STAFF' ? 'staff' : 'student';
         const persona = MOCK_PERSONAS[selectedRole];

         // Check if a mock user already exists in Sanity, or create one for realistic queries
         let sanityUser = null;
         try {
            sanityUser = await sanityClient.fetch(
               `*[_type == '${persona.role === 'STAFF' ? 'staff' : 'student'}' && email == $email][0]`,
               { email: persona.email }
            );

            if (!sanityUser) {
               sanityUser = await sanityClient.create({
                  _type: persona.role === 'STAFF' ? 'staff' : 'student',
                  names: `${persona.firstName} ${persona.lastName}`,
                  email: persona.email,
                  currentClass: persona.currentClass,
               });
            }
         } catch (sanityErr) {
            console.warn('Sanity offline/read-only during mock auth. Falling back to memory profile.');
            sanityUser = {
               _id: persona.id,
               names: `${persona.firstName} ${persona.lastName}`,
               email: persona.email,
               currentClass: persona.currentClass,
            };
         }

         const tokenPayload = {
            id: sanityUser._id || persona.id,
            email: persona.email,
            role: persona.role,
         };

         const login_token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
            expiresIn: '30d',
         });

         const mockProfile = {
            user: { email: persona.email },
            person: {
               firstName: persona.firstName,
               lastName: persona.lastName,
               email: persona.email,
               currentClass: persona.currentClass ? { className: persona.currentClass } : undefined,
            },
            roles: [{ roleName: persona.role }],
         };

         return NextResponse.json(
            new Response(
               { profile: mockProfile, token: login_token, misToken: `mock-token-${persona.role.toLowerCase()}` },
               undefined,
               'Logged in successfully via Mock Auth',
               true
            ),
            { status: 200 }
         );
      }

      // =========================================================================
      // 2. STANDARD RCA MIS PRODUCTION FLOW (On-Campus)
      // =========================================================================
      const token = body?.token;
      if (!token) {
         return NextResponse.json({ message: 'Token is required' }, { status: 400 });
      }

      const _res = await misApi.get('/auth/profile', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });
      const profile = _res.data.data;
      if (!profile) return NextResponse.json({ message: 'user not found' }, { status: 400 });

      const role = _res.data?.data?.roles[0]?.roleName;
      if (!role) return NextResponse.json({ message: 'MIS Role not found' }, { status: 400 });

      const isStaff = role !== 'STUDENT';
      const student = await sanityClient.fetch(
         `*[_type == '${isStaff ? 'staff' : 'student'}' && email == $email][0]`,
         { email: profile.user?.email }
      );

      let studentData = student;
      if (!student && !isStaff) {
         studentData = await createStudent(profile);
      } else if (!student && isStaff) {
         studentData = await createStaff(profile);
      }

      const login_token = jwt.sign(
         { email: studentData.email, id: studentData?._id },
         process.env.JWT_SECRET!,
         { expiresIn: '30d' }
      );

      return NextResponse.json(new Response({ profile, token: login_token }, undefined, 'Logged in', true), {
         status: 200,
      });
   } catch (error: any) {
      console.error('Error logging in', error?.response || error);
      return NextResponse.json(new Response(undefined, error, 'Error logging in'), { status: 500 });
   }
}

const createStudent = async (profile: any) => {
   return await sanityClient.create({
      _type: 'student',
      names: profile.person.firstName + ' ' + profile.person.lastName,
      email: profile.person.email,
      currentClass: profile?.person?.currentClass?.className,
   });
};

const createStaff = async (profile: any) => {
   return await sanityClient.create({
      _type: 'staff',
      names: profile.person.firstName + ' ' + profile.person.lastName,
      email: profile.person.email,
   });
};
