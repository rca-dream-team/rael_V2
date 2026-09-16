import RText from '@/components/constants/RighteousText';
import { urlFor } from '@/sanity/sanity.client';
import { News } from '@/types/news';
import { Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

interface NewsTileProps {
   data: News;
}

const NewsTile = ({ data }: NewsTileProps) => {
   return (
      <Link
         href={`/article/${data.slug.current}`}
         className=" w-full max-h-48 overflow- tileCard hover:bg-gray-50 hover:dark:bg-gray-900 duration-300 flex border"
      >
         <div className=" aspect-square imgCont overflow-hidden w-1/3">
            <Image
               src={urlFor(data.image).url()}
               alt={data.title}
               width={200}
               height={200}
               className=" w-full h-full object-cover"
            />
         </div>
         <div className="w-3/4 p-4 py-2 flex flex-col ">
            <RText className=" font-bold">{data.title}</RText>
            <Text size="sm" c="dimmed" lineClamp={4}>
               {data.excerpt}
            </Text>
         </div>
      </Link>
   );
};

export default NewsTile;
