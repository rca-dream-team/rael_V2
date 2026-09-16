import { defineType } from 'sanity';

export default defineType({
   name: 'galleryImage',
   title: 'Gallery Image',
   type: 'object',
   fields: [
      {
         name: 'image',
         title: 'Image',
         type: 'image',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'title',
         title: 'Title',
         type: 'string',
      },
      {
         name: 'caption',
         title: 'Caption',
         type: 'string',
      },
      {
         name: 'shotBy',
         title: 'Shot by',
         type: 'string',
      },
   ],
});
