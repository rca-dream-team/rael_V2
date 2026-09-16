import { fetchPromotionByName } from '@/sanity/queries';
import { sanityClient } from '@/sanity/sanity.client';
import { IStudent } from '@/types/member.type';

export const requestProfile = async (request: any, requester: IStudent) => {
   const existingRequest = await sanityClient.fetch(`*[_type=='profileRequest' && email == $email][0]`, {
      email: requester.email,
   });
   //console.log('existingRequest', existingRequest);
   const promotion = await fetchPromotionByName(request.promotion);
   //console.log('existing promotion', promotion);
   if (existingRequest) {
      //console.log('request still exists');
      const res = await sanityClient
         .patch(existingRequest._id)
         .set({
            ...request,
            promotion: {
               _type: 'reference',
               _ref: promotion._id,
            },
            email: requester.email,
         })
         .commit();
      return res;
   } else {
      //console.log('request does not exist. Creating new request');
      const res = await sanityClient.create({
         _type: 'profileRequest',
         ...request,
         requester: {
            _type: 'reference',
            _ref: requester._id,
         },
         promotion: {
            _type: 'reference',
            _ref: promotion._id,
         },
         email: requester.email,
      });
      return res;
   }
};

export const getImageBuffer = async (url: string) => {
   const res = await fetch(url);
   const blob = await res.blob();
   const buffer = await blob.arrayBuffer();
   return Buffer.from(buffer);
};
