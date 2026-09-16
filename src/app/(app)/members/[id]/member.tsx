'use client';
import PText from '@/components/constants/PoppinText';
import RText from '@/components/constants/RighteousText';
import { MailIcon } from '@/components/icons';
import { getImageUrl } from '@/sanity/sanity.client';
import { IStudent } from '@/types/member.type';
import Image from 'next/image';
import { FaLink, FaUserCircle } from 'react-icons/fa';
import { IoLogoBehance, IoLogoFacebook, IoLogoGithub, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import { urlFor } from '@/sanity/sanity.client';
import { IoDiscOutline } from 'react-icons/io5';
import Link from 'next/link';

export interface MemberProps {
   member: IStudent;
}

const Member = ({ member }: MemberProps) => {
   // //console.log('member', member);
   return (
      <div className="max-w-[1000px] pb-4 w-full rounded-xl bg-white dark:bg-[#060911] gap-y-11 px-11 flex-col flex">
         <div className="flex py-2 items-center justify-center">
            <div className="flex w-[300px] aspect-square rounded-full border overflow-hidden">
               {member.picture ? (
                  <Image
                     src={getImageUrl(member?.picture)!}
                     width={300}
                     height={300}
                     className="object-cover min-w-full"
                     alt="member"
                  />
               ) : (
                  <div className=" w-full aspect-square justify-center flex items-center">
                     <FaUserCircle className=" text-3xl cursor-pointer" />
                  </div>
               )}
            </div>
            <div className="flex flex-col gap-y-7 w-full px-11">
               <div className="flex flex-col">
                  <RText className=" text-xl uppercase">{member?.names}</RText>
                  <PText className=" font-medium uppercase">{member?.leaderTitle}</PText>
               </div>
               <div className="flex flex-col flex-wrap gap-2 h-20">
                  {member?.occupation?.map((ocu, i) => (
                     <div className="flex gap-2 ml-6" key={i}>
                        <IoDiscOutline />{' '}
                        <PText className=" text-sm">
                           <span key={ocu}>{ocu}</span>
                        </PText>
                     </div>
                  ))}
               </div>
            </div>
         </div>
         <PText className="text-sm">{member?.bio}</PText>
         <div className="grid md:grid-cols-3 sm:grid-cols-2 w-full gap-6">
            {member?.images?.map((im, i) => (
               <Image
                  src={urlFor(im).url()}
                  alt="Alt"
                  className="w-full rounded-xl overflow-hidden"
                  key={i}
                  width={300}
                  height={300}
                  quality={100}
               />
            ))}
         </div>
         <div className="flex w-full gap-x-4 dark:text-white items-center justify-center">
            {/* <MdMail size={30} className=" cursor-pointer" /> */}

            {member.email && (
               <Link href={`mailto:${member.email}`} className="cursor-pointer">
                  <MailIcon size={30} className="cursor-pointer" />
               </Link>
            )}
            {member.socials?.github && (
               <Link href={member.socials?.github?.url ?? '#'}>
                  <IoLogoGithub size={30} className=" cursor-pointer" />
               </Link>
            )}

            {member.socials?.linkedIn && (
               <Link href={member.socials?.linkedIn?.url ?? '#'}>
                  <IoLogoLinkedin size={30} className=" cursor-pointer" />
               </Link>
            )}

            {member.socials?.behance && (
               <Link href={member.socials?.behance?.url ?? '#'}>
                  <IoLogoBehance size={30} className=" cursor-pointer" />
               </Link>
            )}
            {member.socials?.instagram && (
               <Link href={member.socials?.instagram?.url ?? '#'}>
                  <IoLogoInstagram size={30} className=" cursor-pointer" />
               </Link>
            )}

            {member.socials?.facebook && (
               <Link href={member.socials?.facebook?.url ?? '#'}>
                  <IoLogoFacebook size={30} className=" cursor-pointer" />
               </Link>
            )}

            {member.socials?.portfolio && (
               <Link href={member.socials?.portfolio?.url ?? '#'}>
                  <FaLink size={25} className=" cursor-pointer" />
               </Link>
            )}
         </div>
      </div>
   );
};

export default Member;
