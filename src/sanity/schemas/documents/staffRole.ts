import { defineType } from 'sanity';

export default defineType({
   name: 'staffRole',
   title: 'Staff Role',
   type: 'document',
   fields: [
      {
         name: 'name',
         title: 'Name',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
   ],
});
