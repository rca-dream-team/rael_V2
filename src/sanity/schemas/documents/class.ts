import { defineType } from 'sanity';

export default defineType({
   name: 'class',
   title: 'Class',
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
