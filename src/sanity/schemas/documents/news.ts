import { FaNewspaper } from 'react-icons/fa';
import { defineType } from 'sanity';

export default defineType({
   name: 'news',
   title: 'News',
   icon: FaNewspaper,
   type: 'document',
   fields: [
      {
         name: 'title',
         description: 'Title of the news article.',
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
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'excerpt',
         title: 'Excerpt',
         description: 'A short description of the news article.',
         type: 'text',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'date',
         title: 'Date',
         type: 'date',
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'image',
         title: 'Image',
         type: 'image',
      },
      {
         name: 'content',
         title: 'Content',
         description: 'The content of the news article.',
         type: 'array',
         of: [
            {
               type: 'block',
            },
            {
               type: 'image',
            },
            {
               type: 'file',
            },
         ],
         validation: (Rule) => Rule.required(),
      },
      {
         name: 'commentQuestion',
         title: 'Comment Question',
         description: 'A question to ask users when commenting on the news article.',
         type: 'string',
      },
      {
         name: 'author',
         title: 'Author',
         type: 'reference',
         to: [{ type: 'author' }],
      },
      {
         name: 'category',
         title: 'Category',
         type: 'reference',
         to: [{ type: 'news-category' }],
         validation: (Rule) => Rule.required(),
      },
   ],
   preview: {
      select: {
         title: 'title',
         date: 'date',
         media: 'image',
      },
      prepare(selection) {
         const { title, date, media } = selection;
         return {
            title,
            subtitle: date,
            media,
         };
      },
   },
});
