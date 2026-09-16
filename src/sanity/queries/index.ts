import { groq } from 'next-sanity';
import { sanityClient } from '../sanity.client';

export const leaderTitleQuery = groq`*[_type=='leaderTitle']`;

export const fetchPromotionByName = (name: string) =>
   sanityClient.fetch(groq`*[_type == 'promotion' && name == $name][0]`, {
      name,
   });
