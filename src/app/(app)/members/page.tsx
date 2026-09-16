import { getAllStaffsQuery, getAllStudentsQuery } from '@/sanity/queries/member.query';
import { sanityClient } from '@/sanity/sanity.client';
import { Metadata } from 'next';
import Members from './_members';

export const revalidate = 15; // 15 seconds

const getMembers = async (type: 'staff' | 'student') => {
   if (type === 'student') return await sanityClient.fetch(getAllStudentsQuery);
   return await sanityClient.fetch(getAllStaffsQuery);
};

export const metadata: Metadata = {
   title: 'RCA Members - RAEL',
};

const MembersPage = async () => {
   const students = await getMembers('student');
   const staffs = await getMembers('staff');
   // //console.log('students', students);

   return (
      <>
         <div className="w-[90%]">
            <Members students={students} staffs={staffs} />
         </div>
      </>
   );
};

export default MembersPage;
