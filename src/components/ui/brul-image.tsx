import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
   src: string;
}

export const BlurImage = (props: Props) => {
   const { src, alt, className, width, height, ...rest } = props;
   const [loaded, setLoaded] = useState(false);
   return (
      <Image
         src={src}
         height={height ? Number(height) : '500'}
         width={width ? Number(width) : '500'}
         onLoad={() => setLoaded(true)}
         className={cn(
            `object-contain object-top  inset-0 h-full transition duration-200 ${loaded ? 'blur-none' : 'blur-md'} ${className}`,
         )}
         alt={alt ?? 'thumbnail'}
         {...rest}
      />
   );
};

export default BlurImage;
