import { defineField, defineType } from 'sanity';

export default defineType({
   name: 'author',
   title: 'Author',
   type: 'document',
   fields: [
      {
         name: 'author',
         title: 'Author',
         type: 'reference',
         to: [{ type: 'student' }, { type: 'staff' }],
      },
      defineField({
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
            hotspot: true,
         },
      }),
   ],
   preview: {
      select: {
         title: 'author.names',
         media: 'image',
      },
   },
});
