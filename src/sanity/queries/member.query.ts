import { groq } from 'next-sanity';
import { sanityClient } from '../sanity.client';

const generalStudentFields = `
  _id,
  names,
  email,
  picture,
  classes,
  "promotion": promotion->name,
  occupation,
  leaderTitle,
`;

const generalStaffFields = `
 ...,
 "role": staffRole->name,
`;

export const getAllStudentsQuery = groq`
  *[_type == 'student' && !(_id in path("drafts.**"))] {
    ${generalStudentFields}
  }
`;

export const studentFields = groq`
    _id,
    names,
    email,
    picture,
    classes,
    "promotion": promotion->name,
    occupation,
    leaderTitle,
    images,
    socials,
    bio,
`;

export const getStudentByIdQuery = groq`
    *[_type == 'student' && _id == $id][0]  {
        _id,
        names,
        email,
        picture,
        pictureUrls,
        bio,
        classes,
        promotion,
        occupation,
        leaderTitle,
        projects,
        images,
        socials,
    }
    `;

export const getAllStaffsQuery = groq`
  *[_type == 'staff' && !(_id in path("drafts.**"))] {
    ${generalStaffFields}
  }
`;

export const getStaffByIdQuery = groq`
    *[_type == 'staff' && _id == $id][0] {
        ${generalStaffFields}
    }
`;

export const getMember = async (id: string, type?: string) => {
   if (type === 'student') {
      return await sanityClient.fetch(getStudentByIdQuery, { id });
   }
   if (type === 'staff') {
      return await sanityClient.fetch(getStaffByIdQuery, { id });
   }
   return await sanityClient.fetch(`*[_id == $id][0]`, { id });
};
