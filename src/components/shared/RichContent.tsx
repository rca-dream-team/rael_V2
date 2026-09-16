import React from 'react';
import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import Image from 'next/image';
import { Children, Content } from '@/types/news';
import { urlFor } from '@/sanity/sanity.client';

interface RichContentProps {
   content: Content[];
}

const RichContent = ({ content }: RichContentProps) => {
   const ImageComponent = ({ value, isInline }: any) => {
      const { width, height } = getImageDimensions(value);
      return (
         <Image
            src={urlFor(value)
               .width(isInline ? 800 : 800)
               .fit('max')
               .auto('format')
               .url()}
            alt={value.alt || ' '}
            loading="lazy"
            width={width}
            height={height}
            className=" py-4 w-full"
            style={{
               // Display alongside text if image appears inside a block text span
               display: isInline ? 'inline-block' : 'block',

               // Avoid jumping around with aspect-ratio CSS property
               aspectRatio: width / height,
            }}
         />
      );
   };

   const SpanElement = ({ child }: { child: Children }) => {
      const { _key, marks, text } = child;
      const styles = {
         textDecoration: marks.includes('underline') ? 'underline' : 'none',
         fontWeight: marks.includes('medium') ? 'semibold' : 'normal',
         fontStyle: marks.includes('em') ? 'italic' : 'normal',
      };

      return (
         <span key={_key} className={marks.join(' ')} style={styles}>
            {text}
         </span>
      );
   };

   const components: Partial<PortableTextReactComponents> = {
      types: {
         image: ImageComponent,
         // Any other custom types you have in your content
         // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
         block: ({ value }) => {
            const c: Content = value;
            if (value.listItem) {
               return (
                  <ul key={c._key} className="list-disc list-inside my-1">
                     {c.children?.map((child) => {
                        return (
                           <li key={child._key}>
                              <SpanElement child={child} />
                           </li>
                        );
                     })}
                  </ul>
               );
            }
            return (
               <div key={c._key} className=" my-1">
                  {c.children?.map((child) => {
                     return <SpanElement key={child._key} child={child} />;
                  })}
               </div>
            );
         },
      },
   };
   return <PortableText value={content} components={components} />;
};

export default RichContent;
