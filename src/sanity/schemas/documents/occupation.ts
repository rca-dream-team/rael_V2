import { defineType } from 'sanity';

export default defineType({
   name: 'occupation',
   title: 'Occupation',
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
   ],
});
