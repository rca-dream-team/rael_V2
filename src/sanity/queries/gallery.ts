import { groq } from 'next-sanity';
import { sanityClient } from '../sanity.client';

export const galleryFields = groq`
    _id,
    _createdAt,
    _updatedAt,
    date,
    name,
    description,
    coverImage,
    images
`;

// exclude draft and order by date
export const fetchGalleryQuery = groq`
    *[_type == "gallery" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
        ${galleryFields}
    }
`;

export const fetchGallery = () => sanityClient.fetch(fetchGalleryQuery);

export const fetchGalleryPaginated = (page: number, pageSize: number) => {
   return sanityClient.fetch(
      groq`
            *[_type == "gallery"] | order(_createdAt desc) [${(page - 1) * pageSize}...${page * pageSize} && !(_id in path("drafts.**"))] {
                ${galleryFields}
            }
        `,
   );
};

export const fetchGalleryById = (id: string) => {
   return sanityClient.fetch(
      groq`
            *[_type == "gallery" && _id == $id][0] {
                ${galleryFields}
            }
        `,
      { id },
   );
};
