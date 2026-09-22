import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileRequest } from '@/sanity/queries/requests';
import { sanityClient } from '@/sanity/sanity.client';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
   try {
      const body = await req.json();
      const { email, isApproved } = body;
      if (!isApproved) {
         return NextResponse.json({ message: 'Enter all required parameters' }, { status: 400 });
      }

      const requestData = await fetchProfileRequest(email);
      if (!requestData) {
         return NextResponse.json({ message: 'Request not found' }, { status: 404 });
      }

      const promotion = await sanityClient.fetch(`*[_type=='promotion' && name == $name][0]`, {
         name: requestData.promotion,
      });

      const _res = await sanityClient
         .patch(requestData.requester._id)
         .set({
            socials: requestData.socials,
            bio: requestData.bio,
            leaderTitle: requestData.leaderTitle,
            promotion: {
               _type: 'reference',
               _ref: promotion._id,
            },
            occupation: requestData.occupation,
         })
         .commit();

      await sanityClient.delete(requestData._id);
      return NextResponse.json({ message: 'Approve Webhook Success!', data: _res });
   } catch (error) {
      console.error('Error approving profile:', error);
      return NextResponse.json({ message: 'Error approving profile' }, { status: 400 });
   }
}
