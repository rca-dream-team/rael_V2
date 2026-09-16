import { defineType } from 'sanity';

export default defineType({
   name: 'Post',
   title: 'Post',
   type: 'document',
   fields: [
      {
         name: 'title',
         title: 'Title',
         type: 'string',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'slug',
         title: 'Slug',
         type: 'slug',
         options: {
            source: 'title',
            maxLength: 96,
         },
      },
      {
         name: 'author',
         title: 'Author',
         type: 'reference',
         to: { type: 'Author' },
      },
      {
         name: 'mainImage',
         title: 'Main image',
         type: 'image',
         options: {
            hotspot: true,
         },
      },
      {
         name: 'body',
         title: 'Body',
         type: 'blockContent',
      },
   ],
});
