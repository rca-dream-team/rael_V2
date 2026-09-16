import { defineType } from 'sanity';

export default defineType({
   name: 'promotion',
   title: 'Promotion',
   type: 'document',
   fields: [
      {
         name: 'name',
         title: 'Name',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'year',
         title: 'Year',
         type: 'number',
      },
      // {
      //    name: 'students',
      //    title: 'Students',
      //    type: 'array',
      //    of: [{ type: 'reference', to: [{ type: 'student' }] }],
      // },
      {
         name: 'start',
         title: 'Start',
         type: 'date',
      },
      {
         name: 'end',
         title: 'End',
         type: 'date',
      },
   ],
});
