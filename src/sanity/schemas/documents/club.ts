import { defineType } from 'sanity';

export default defineType({
   name: 'club',
   title: 'Club',
   type: 'document',
   fields: [
      {
         name: 'name',
         title: 'Name',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'description',
         title: 'Description',
         type: 'text',
      },
      {
         name: 'logo',
         title: 'Logo',
         type: 'image',
      },
      {
         name: 'members',
         title: 'Members',
         type: 'array',
         of: [{ type: 'reference', to: [{ type: 'student' }] }],
      },
   ],
});
