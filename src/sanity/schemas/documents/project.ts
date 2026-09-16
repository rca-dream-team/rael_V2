import { defineType, defineField } from 'sanity';

export default defineType({
   name: 'project',
   title: 'Project',
   type: 'document',
   fields: [
      defineField({
         name: 'name',
         title: 'Name',
         type: 'string',
         validation: (Rule) => Rule.required(),
      }),
      defineField({
         name: 'slug',
         title: 'Slug',
         type: 'slug',
         options: {
            source: 'name',
            maxLength: 96,
         },
      }),
      defineField({
         name: 'description',
         title: 'Description',
         type: 'text',
         validation: (Rule) => Rule.required(),
      }),
      defineField({
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
            hotspot: true,
         },
      }),
      defineField({
         name: 'url',
         title: 'URL',
         type: 'url',
      }),
      defineField({
         name: 'github',
         title: 'Github',
         type: 'url',
      }),
      {
         name: 'tags',
         title: 'Tags',
         type: 'array',
         of: [{ type: 'string' }],
      },
      defineField({
         name: 'start',
         title: 'Start',
         type: 'date',
      }),
      defineField({
         name: 'end',
         title: 'End',
         type: 'date',
      }),
   ],
   preview: {
      select: {
         title: 'name',
         media: 'image',
      },
   },
});
