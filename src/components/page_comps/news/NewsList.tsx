import RText from '@/components/constants/RighteousText';
import BlurImage from '@/components/ui/brul-image';
import { News } from '@/types/news';
import { Text } from '@mantine/core';
import Link from 'next/link';

interface NewsCardProps {
   data: News;
}

const NewsList = ({ data }: NewsCardProps) => {
   return (
      <Link
         href={`/article/${data.slug.current}`}
         className="border gap-2 duration-300 flex hover:bg-gray-50 hover:dark:bg-gray-900 rounded-xl w-full sm:h-[120px] p-4"
      >
         <BlurImage
            src={data.image ?? 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'}
            alt={data.title}
            className="w-[120px] object-cover rounded-xl"
         />
         <div className="flex flex-col w-full">
            <RText className="lg:text-xl text-sm">
               <h2>{data.title}</h2>
            </RText>
            <Text lineClamp={2} className=" mt-3 lg:text-sm text-xs font-poppins">
               {data.excerpt}
            </Text>
         </div>
      </Link>
   );
};

export default NewsList;
