import { sanityClient } from '../../sanity.client';
import { groq } from 'next-sanity';
import { ValidationContext, defineType } from 'sanity';

const isUniqueEmail = (profileRequest: any, context: ValidationContext) => {
   const { document } = context;
   const id = document?._id.replace(/^drafts\./, '');

   const params = {
      draft: `drafts.${id}`,
      published: id,
      profileRequest,
   };

   const query = groq`!defined(*[
      _type == 'profileRequest' &&
      !(_id in [$draft, $published]) &&
      email == $profileRequest
    ][0]._id)`;

   return sanityClient.fetch(query, params);
};
// defineField
export default defineType({
   name: 'profileRequest',
   title: 'Profile Request',
   type: 'document',
   groups: [
      {
         title: 'Main Information',
         name: 'mainInfo',
         default: true,
      },
      {
         title: 'Pictures',
         name: 'pictures',
      },
      {
         name: 'extraCurricula',
         title: 'Extra Curricula',
      },
      {
         name: 'socials',
         title: 'Socials',
      },
   ],
   fields: [
      {
         name: 'requester',
         title: 'Requester',
         type: 'reference',
         to: [{ type: 'student' }],
         validation: (Rule) => Rule.required(),
         group: ['mainInfo'],
      },
      {
         name: 'isApproved',
         title: 'Is Approved',
         description: 'Is the profile request approved?',
         type: 'boolean',
         group: ['mainInfo'],
         initialValue: false,
      },
      {
         name: 'status',
         title: 'Status',
         type: 'string',
         options: {
            list: ['Pending', 'Approved', 'Declined'],
         },
         group: ['mainInfo'],
         initialValue: 'Pending',
      },
      {
         name: 'email',
         title: 'Email',
         type: 'email',
         validation: (Rule) =>
            Rule.required().custom(async (value, context) => {
               const isUnique = await isUniqueEmail(value, context);
               if (!isUnique) return 'Email is owned by other student.';
               return true;
            }),
         description: "Student email should not be duplicated. I can't be assigned to more than 1 student request",
         group: ['mainInfo'],
      },
      {
         name: 'picture',
         title: 'Picture',
         type: 'image',
         options: {
            hotspot: true,
         },
         group: ['pictures'],
      },
      {
         name: 'promotion',
         title: 'Promotion',
         type: 'reference',
         to: [{ type: 'promotion' }],
         validation: (Rule) => Rule.required(),
         group: ['mainInfo'],
      },
      {
         name: 'bio',
         title: 'Bio',
         type: 'string',
         group: ['mainInfo'],
      },
      {
         name: 'occupation',
         title: 'Occupation',
         type: 'array',
         of: [{ type: 'string' }],
         group: ['extraCurricula'],
      },
      {
         name: 'leaderTitle',
         title: 'Leader Title',
         type: 'string',
         description: 'Ex: Chairman, Vice President of media club, etc.',
         group: ['extraCurricula'],
      },
      {
         name: 'socials',
         title: 'Socials',
         type: 'socials',
         group: ['socials'],
      },
      {
         name: 'images',
         title: 'Images',
         type: 'array',
         of: [{ type: 'image' }],
         group: ['pictures'],
      },
   ],
   preview: {
      select: {
         title: 'requester.names',
         subtitle: 'requester.email',
      },
   },
});
