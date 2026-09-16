import { defineType } from 'sanity';

export default defineType({
   name: 'gallery',
   title: 'Gallery',
   type: 'document',
   fields: [
      {
         name: 'name',
         title: 'Name',
         type: 'string',
         description: 'Name of the gallery',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'date',
         title: 'Date',
         type: 'date',
         description: 'Date of the gallery',
         validation: (Rule) => Rule.required(),
         initialValue: () => new Date().toISOString(),
      },
      {
         name: 'description',
         title: 'Description',
         type: 'text',
         description: 'Description of the gallery',
      },
      {
         name: 'coverImage',
         title: 'Cover Image',
         type: 'image',
         description: 'Cover image of the gallery',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'images',
         title: 'Images',
         type: 'array',
         of: [{ type: 'image' }],
         validation: (Rule) => Rule.required(),
      },
   ],
});
