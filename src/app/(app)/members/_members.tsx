'use client';
import MembersDisplay from '@/components/page_comps/members/MembersDisplay';
import PromFilter from '@/components/page_comps/members/PromFilter';
import { useSearchParams } from '@/lib/hooks/useSearchParams';
import { IStaff, IStudent } from '@/types/member.type';
import { Input } from '@mantine/core';
import { useSearchParams as useNextParams } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

interface MembersProps {
   students: IStudent[];
   staffs: IStaff[];
}

const Members: FC<MembersProps> = ({ staffs, students }) => {
   const [tab, setTab] = React.useState<'students' | 'staffs'>('students');
   const [filter, setFilter] = React.useState('');
   const [filteredStudents, setFilteredStudents] = React.useState<IStudent[]>([]);
   const [filteredStaffs, setFilteredStaffs] = React.useState<IStaff[]>([]);
   const searchParams = useNextParams();
   const { updateParam } = useSearchParams();

   useEffect(() => {
      if (!searchParams) return;
      const tab: any = searchParams.get('tab');
      if (tab) setTab(tab);
      const filter = searchParams.get('filter');
      if (filter) setFilter(filter);
   }, [searchParams]);

   useEffect(() => {
      if (tab === 'students') {
         if (filter) handlePromChange(filter);
         else setFilteredStudents(students);
      } else {
         setFilteredStaffs(staffs);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tab, students, staffs]);

   const handlePromChange = (e: string | null) => {
      e && setFilter(e);
      if (e) {
         const filtered = students.filter((student) => student.promotion === e);
         setFilteredStudents(filtered);
      } else {
         setFilteredStudents(students);
      }
      updateParam('page', 1);
   };

   const handleSearch = (e: string) => {
      setFilter(e);
      if (e) {
         const filtered = students.filter((student) => {
            const json = JSON.stringify(student);
            return json.toLowerCase().includes(e.toLowerCase());
         });
         setFilteredStudents(filtered);
         updateParam('page', 1);
      } else {
         setFilteredStudents(students);
      }
   };

   return (
      <>
         <div className=" flex justify-between md:flex-row flex-col gap-2 items-center w-full">
            {tab === 'students' ? <PromFilter handleChange={handlePromChange} label="Filter" /> : <div></div>}
            <div className=" border-2 bg-white dark:bg-black dark:border-slate-900/90 overflow-hidden flex items-center w-fit max-w-[300px] rounded-[3em]">
               <button
                  onClick={() => setTab('students')}
                  className={`2sm:py-2 cursor-pointer w-32  py-2 whitespace-nowrap px-3 2sm:text-base text-sm rounded-[3em] 2sm:px-5 ${
                     tab === 'students'
                        ? 'dark:bg-white dark:text-black bg-black text-white'
                        : 'dark:bg-black dark:text-white bg-white text-black'
                  }`}
               >
                  Students
               </button>
               <button
                  onClick={() => setTab('staffs')}
                  className={`2sm:py-2 cursor-pointer w-32  py-2 whitespace-nowrap px-3 2sm:text-base text-sm rounded-[3em] 2sm:px-5 ${
                     tab === 'staffs'
                        ? 'dark:bg-white dark:text-black bg-black text-white'
                        : 'dark:bg-black dark:text-white bg-white text-black'
                  }`}
               >
                  Staffs
               </button>
            </div>
            <div className="">
               <Input.Wrapper label="Search" className="w-full">
                  <Input
                     value={filter}
                     onChange={(e) => handleSearch(e.currentTarget.value)}
                     placeholder="Search"
                     className="w-full"
                     rightSection={<FaSearch />}
                  />
               </Input.Wrapper>
            </div>
         </div>
         <MembersDisplay filteredStaffs={filteredStaffs} filteredStudents={filteredStudents} tab={tab} />
      </>
   );
};

export default Members;
