import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Log Sanity configuration for debugging in development
if (process.env.NODE_ENV !== 'production') {
   //console.log('Sanity configuration:', {
   //    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
   //    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rrmy9xks',
   //    hasToken: Boolean(process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_TOKEN)
   // });
}

export const sanityConfig: any = {
   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rrmy9xks',
   useCdn: typeof document !== 'undefined' && process.env.NODE_ENV === 'production',
   apiVersion: '2022-11-16',
   token: process.env.SANITY_TOKEN ?? process.env.NEXT_PUBLIC_TOKEN,
};

// Create Sanity client with error handling
export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
   if (!source) {
      console.warn('Warning: urlFor called with null/undefined source');
      // Return a placeholder or empty string to prevent runtime errors
      return {
         url: () => 'https://via.placeholder.com/150',
         width: () => ({ height: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
         height: () => ({ width: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
         auto: () => ({ format: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
      } as any;
   }
   
   try {
      return builder.image(source);
   } catch (error) {
      console.error('Error in urlFor:', error);
      // Return a placeholder to prevent runtime errors
      return {
         url: () => 'https://via.placeholder.com/150',
         width: () => ({ height: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
         height: () => ({ width: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
         auto: () => ({ format: () => ({ url: () => 'https://via.placeholder.com/150' }) }),
      } as any;
   }
}

export const getImageUrl = (source: any) => {
   if (!source) return null;
   
   try {
      return builder.image(source).url();
   } catch (error) {
      console.error('Error in getImageUrl:', error);
      return 'https://via.placeholder.com/150';
   }
};
