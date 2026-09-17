import { fetchProfileRequest } from '@/sanity/queries/requests';
import { sanityClient } from '@/sanity/sanity.client';
import { NextApiRequest, NextApiResponse } from 'next';

// *** This is sanity webhook handler to approve profile request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'PUT') {
      try {
         //console.log('Approve Webhook', req.body);
         const { email, isApproved } = req.body;
         if (!isApproved) {
            //console.log(`${_id} isApproved`, isApproved);
            return res.json({ message: 'Enter all required parameters' });
         }
         const requestData = await fetchProfileRequest(email);
         // update the profile of the requester
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
         // delete the request
         await sanityClient.delete(requestData._id);
         //console.log('res_data', _res);
         res.json({ message: 'Approve Webhook Success!', data: _res });
      } catch (error) {
         //console.log('error', error);
         res.status(400).json({ message: 'Error approving profile' });
      }
   }
}
