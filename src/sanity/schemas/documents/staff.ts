import { defineType } from 'sanity';

export default defineType({
   name: 'staff',
   title: 'Staff',
   type: 'document',
   fields: [
      {
         name: 'names',
         title: 'Names',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'email',
         title: 'Email',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'picture',
         title: 'Picture',
         type: 'image',
         options: {
            hotspot: true,
         },
      },
      {
         name: 'bio',
         title: 'Bio',
         type: 'text',
      },
      {
         name: 'role',
         title: 'Role',
         type: 'reference',
         to: [{ type: 'staffRole' }],
      },
      // roles
      {
         name: 'roles',
         title: 'Roles',
         type: 'array',
         of: [{ type: 'reference', to: [{ type: 'staffRole' }] }],
      },
   ],
});
