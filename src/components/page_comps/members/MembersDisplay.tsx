import { useSearchParams } from '@/lib/hooks/useSearchParams';
import { getImageUrl } from '@/sanity/sanity.client';
import { ImageAsset } from '@/types/gallery';
import { IStudent, IStaff } from '@/types/member.type';
import { Card, Pagination } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface MembersProps {
   filteredStudents: IStudent[];
   filteredStaffs: IStaff[];
   tab: 'students' | 'staffs';
}

const MembersDisplay = (props: MembersProps) => {
   const { filteredStudents, tab, filteredStaffs } = props;
   const { params, updateParam } = useSearchParams();
   const [students, setStudents] = React.useState<IStudent[]>([]);
   const [pagination, setPagination] = React.useState({ page: params.page ? +params.page : 1, limit: 20, total: 0 });

   useEffect(() => {
      const total = Math.ceil(filteredStudents.length / pagination.limit);
      filteredStudents.length > 0 && setPagination({ ...pagination, total });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pagination.limit, filteredStudents]);

   useEffect(() => {
      const students = filteredStudents.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
      setStudents(students);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pagination, filteredStudents]);

   const handlePagination = (page: number) => {
      updateParam('page', page);
      setPagination({ ...pagination, page });
   };

   return (
      <div className=" w-full flex flex-col items-center gap-3">
         <div className="grid xl:grid-cols-5 lg:grid-cols-4 pb-14 md:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-6 w-full gap-2 mt-4">
            {tab === 'students'
               ? students.map((student) => (
                    <MemberCard
                       key={student._id}
                       image={student.picture}
                       names={student.names}
                       description={student.promotion}
                       type="student"
                       _id={student._id}
                    />
                 ))
               : filteredStaffs.map((staff) => (
                    <MemberCard
                       key={staff._id}
                       image={staff.picture}
                       names={staff.names}
                       description={staff.role}
                       type="staff"
                       _id={staff._id}
                    />
                 ))}
         </div>
         {tab === 'students' && (
            <div className="absolute bg-white p-2 rounded-md duration-300 hover:shadow hover:shadow-gray-600 dark:bg-black bottom-14 left-1/2 -translate-x-1/2">
               <Pagination total={pagination.total} value={pagination.page} onChange={handlePagination} className="" />
            </div>
         )}
      </div>
   );
};

type CardProps = {
   image?: string | null | ImageAsset;
   names: string;
   description: string;
   type: 'student' | 'staff';
   _id: string;
};

const MemberCard: FC<CardProps> = (props) => {
   const { image, names, description } = props;
   return (
      <Card padding={0} shadow="sm">
         <Link href={`/members/${props._id}?type=${props.type}` as any} className=" w-full h-fit rounded-xl text-center">
            <div className=" w-full aspect-square overflow-hidden max-w-[300px] justify-center flex items-center">
               {image ? (
                  <Image
                     src={getImageUrl(image)!}
                     width={200}
                     height={200}
                     className="object-cover min-w-full h-full"
                     alt="member"
                  />
               ) : (
                  <FaUserCircle className=" text-3xl cursor-pointer" />
               )}
            </div>
            <div className="flex flex-col p-2">
               <p className="text-md text-center font-bold mt-1">{names}</p>
               <span className="text-sm text-center text-gray-600 w-full mx-auto justify-center flex">{description}</span>
            </div>
         </Link>
      </Card>
   );
};

export default MembersDisplay;
