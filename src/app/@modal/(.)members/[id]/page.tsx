import Member from '@/app/(app)/members/[id]/member';
import Modal from '@/components/shared/Modal';
import { getMember, getStudentByIdQuery } from '@/sanity/queries/member.query';
import { sanityClient, urlFor } from '@/sanity/sanity.client';
import { IStudent } from '@/types/member.type';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 15;

interface MemberModalPageProps {
   params: {
      id: string;
   };
   searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
   { params, searchParams }: MemberModalPageProps,
   parent: ResolvingMetadata,
): Promise<Metadata> {
   const id = params.id;
   const type = searchParams.type as string;
   const student: IStudent = await getMember(id, type);

   return {
      title: `${student.names ?? 'RCA Member'} - RAEL`,
      description: student.bio,
      openGraph: {
         images: [student?.picture ? urlFor(student.picture).url() : ''],
      },
   };
}

export default async function MemberModal({ params, searchParams }: MemberModalPageProps) {
   const id = params?.id;
   const type = searchParams?.type as string;
   if (!id) notFound();
   const member = await getMember(id, type);

   return (
      <Modal>
         <Member member={member} />
      </Modal>
   );
}
