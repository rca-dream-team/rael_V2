import { defineField, defineType } from 'sanity';

export default defineType({
   name: 'timeline',
   title: 'Timeline',
   type: 'document',
   fields: [
      {
         name: 'title',
         title: 'Title',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'description',
         title: 'Description',
         type: 'text',
         validation: (Rule) => Rule.required(),
      },
      // url
      {
         name: 'url',
         title: 'URL',
         type: 'string',
      },
      {
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
            hotspot: true,
         },
      },
      defineField({
         name: 'time',
         title: 'time',
         type: 'datetime',
      }),
   ],
});
