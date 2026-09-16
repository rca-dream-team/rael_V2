import { defineType } from 'sanity';

export default defineType({
   name: 'socials',
   title: 'Socials',
   type: 'object',
   fields: [
      {
         name: 'linkedIn',
         title: 'LinkedIn',
         type: 'link',
      },
      {
         name: 'twitter',
         title: 'Twitter',
         type: 'link',
      },
      {
         name: 'facebook',
         title: 'Facebook',
         type: 'link',
      },
      {
         name: 'instagram',
         title: 'Instagram',
         type: 'link',
      },
      {
         name: 'github',
         title: 'Github',
         type: 'link',
      },
      {
         name: 'portfolio',
         title: 'Portfolio',
         type: 'link',
      },
      {
         name: 'behance',
         title: 'Behance',
         type: 'link',
      },
      {
         name: 'dribbble',
         title: 'Dribbble',
         type: 'link',
      },
   ],
});
