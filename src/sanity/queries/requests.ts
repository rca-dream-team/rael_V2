import { groq } from 'next-sanity';
import { sanityClient } from '../sanity.client';

export const profileRequestFields = groq`
    ...,
    requester->,
    isApproved,
    "promotion": promotion->name,
    email,
    `;

export const fetchProfileRequest = (email: string) =>
   sanityClient.fetch(groq`*[_type=='profileRequest' && email == $email][0] {${profileRequestFields}}`, {
      email,
   });
