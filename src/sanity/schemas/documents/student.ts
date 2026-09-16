import { AsyncListInput } from '../../../sanity/components/AsyncListInput';
import { groq } from 'next-sanity';
import { ValidationContext, defineType } from 'sanity';
import { sanityClient } from '../../sanity.client';

const isUniqueEmail = (student: any, context: ValidationContext) => {
   const { document } = context;
   const id = document?._id.replace(/^drafts\./, '');

   const params = {
      draft: `drafts.${id}`,
      published: id,
      student,
   };

   /* groq */
   const query = groq`!defined(*[
     _type == 'student' &&
     !(_id in [$draft, $published]) &&
     email == $student
   ][0]._id)`;

   return sanityClient.fetch(query, params);
};

export default defineType({
   name: 'student',
   title: 'Student',
   type: 'document',
   groups: [
      {
         title: 'Student Information',
         name: 'studentInformation',
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
         name: 'names',
         title: 'Names',
         type: 'string',
         validation: (Rule) => Rule.required(),
         group: ['studentInformation'],
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
         description: "Student email should not be duplicated. I can't be assigned to more than 1 student",
         group: ['studentInformation'],
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
         group: ['studentInformation'],
      },
      {
         name: 'bio',
         title: 'Bio',
         type: 'string',
         group: ['studentInformation'],
      },
      {
         name: 'currentClass',
         title: 'Current Class',
         type: 'string',
         group: ['studentInformation'],
      },
      {
         name: 'occupation',
         title: 'Occupation',
         type: 'array',
         of: [{ type: 'string' }],
         options: {
            list: [],
            query: `*[_type == "occupation"]{_id, name}`,
            formatResponse: (res: any[]) => res.map((item) => ({ value: item.name, title: item.name })),
         },
         components: {
            input: AsyncListInput,
         },
         group: ['extraCurricula'],
      },
      {
         name: 'leaderTitle',
         title: 'Leader Title',
         type: 'string',
         description: 'Ex: Chairman, Vice President of media club, etc.',
         group: ['extraCurricula'],
      },
      // {
      //    name: 'isMaintainer',
      //    title: 'Is Maintainer',
      //    type: 'boolean',
      //    group: ['extraCurricula'],
      //    description: 'Is this student a maintainer of the website?',
      //    initialValue: false,
      // },
      {
         name: 'clubs',
         title: 'Clubs',
         type: 'array',
         of: [{ type: 'reference', to: [{ type: 'club' }] }],
         group: 'extraCurricula',
      },
      {
         name: 'projects',
         title: 'Projects',
         type: 'array',
         of: [{ type: 'reference', to: [{ type: 'project' }] }],
         group: ['extraCurricula'],
      },
      {
         name: 'images',
         title: 'Images',
         type: 'array',
         of: [{ type: 'image' }],
         group: ['pictures'],
      },
      {
         name: 'socials',
         title: 'Socials',
         type: 'socials',
         group: ['socials'],
      },
   ],
   preview: {
      select: {
         title: 'names',
         subtitle: 'promotion.name',
         media: 'picture',
      },
   },
});
