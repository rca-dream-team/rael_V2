import { defineType } from 'sanity';

export default defineType({
   name: 'leaderTitle',
   title: 'Leader Title',
   type: 'document',
   fields: [
      {
         name: 'title',
         title: 'Title',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
   ],
});
