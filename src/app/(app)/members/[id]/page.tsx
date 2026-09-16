import { getMember } from '@/sanity/queries/member.query';
import { urlFor } from '@/sanity/sanity.client';
import { IStudent } from '@/types/member.type';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Member from './member';

export const revalidate = 15;

interface MemberPageProps {
   params: {
      id: string;
   };
   searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params, searchParams }: MemberPageProps, parent: ResolvingMetadata): Promise<Metadata> {
   const id = params.id;
   // optionally access and extend (rather than replace) parent metadata
   // const previousImages = (await parent).openGraph?.images || [];
   const student: IStudent = await getMember(id);
   if (!student) notFound();

   return {
      title: `${student.names ?? 'RCA Member'} - RAEL`,
      description: student.bio,
      openGraph: {
         images: [{ url: student?.picture ? urlFor(student?.picture)?.url() : '' }],
      },
   };
}

const MemberPage = async ({ params }: MemberPageProps) => {
   const id = params?.id;
   if (!id) notFound();
   const member = await getMember(id);

   return (
      <>
         <div className="flex flex-col items-center w-full py-6">
            <Member member={member} />
         </div>
      </>
   );
};

export default MemberPage;
