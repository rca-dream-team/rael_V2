import { defineType } from 'sanity';

export default defineType({
   name: 'maintainer',
   title: 'Maintainer',
   type: 'document',
   fields: [
      {
         name: 'maintainer',
         title: 'Maintainer',
         type: 'reference',
         to: [{ type: 'student' }, { type: 'staff' }],
         validation: (Rule) => Rule.required(),
      },
   ],
   preview: {
      select: {
         title: 'maintainer.names',
      },
   },
});
