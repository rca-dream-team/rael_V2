import { sanityClient } from '@/sanity/sanity.client';
import Response from '@/types/response';
import { misApi } from '@/utils/axios.config';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { token } = req.body;
      if (!token) {
         return res.status(400).json({ message: 'Token is required' });
      }
      try {
         const _res = await misApi.get('/auth/profile', {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         const profile = _res.data.data;
         // //console.log('_res', _res.data.data);
         if (!profile) return res.status(400).json({ message: 'user not found' });
         const role = _res.data?.data?.roles[0]?.roleName;
         if (!role) return res.status(400).json({ message: 'MIS Role not found' });
         const isStaff = role !== 'STUDENT';
         // //console.log('profile', profile);
         const student = await sanityClient.fetch(`*[_type == '${isStaff ? 'staff' : 'student'}' && email == $email][0]`, {
            email: profile.user?.email,
         });

         let studentData = student;
         if (!student && !isStaff) {
            const newStudent = await createStudent(profile);
            studentData = newStudent;
            //console.log('new student', newStudent);
         } else if (!student && isStaff) {
            const newStaff = await createStaff(profile);
            studentData = newStaff;
            //console.log('new staff', newStaff);
         }
         const login_token = jwt.sign({ email: studentData.email, id: studentData?._id }, process.env.JWT_SECRET!, {
            expiresIn: '30d',
         });
         return res.status(200).json(new Response({ profile, token: login_token }, undefined, 'Logged in', true));
      } catch (error: any) {
         console.error('Error logging in', error.response);
         return res.status(500).json(new Response(undefined, error, 'Error logging in'));
      }
   }
}

const createStudent = async (profile: any) => {
   const student = await sanityClient.create({
      _type: 'student',
      names: profile.person.firstName + ' ' + profile.person.lastName,
      email: profile.person.email,
      currentClass: profile?.person?.currentClass?.className,
   });
   return student;
};

const createStaff = async (profile: any) => {
   const student = await sanityClient.create({
      _type: 'staff',
      names: profile.person.firstName + ' ' + profile.person.lastName,
      email: profile.person.email,
   });
   return student;
};
