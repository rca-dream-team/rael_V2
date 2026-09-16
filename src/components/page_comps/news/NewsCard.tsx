'use client';
import React from 'react';
import { Card, Image, Text, Group } from '@mantine/core';
import { News } from '@/types/news';
import Link from 'next/link';
import BlurImage from '@/components/ui/brul-image';

interface NewsCardProps {
   data: News;
}

const NewsCard = ({ data }: NewsCardProps) => {
   return (
      <Link href={`/article/${data.slug.current}`} className=" hover:bg-gray-50 hover:dark:bg-gray-900">
         <Card
            shadow="sm"
            padding="0"
            radius="md"
            withBorder
            className="w-full h-full  card hover:bg-gray-50 hover:dark:bg-gray-900 duration-300"
         >
            <div className="imgCont overflow-hidden">
               <Image
                  src={data.image ?? 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'}
                  height={160}
                  className=" object-cover w-full"
                  alt={data.title}
               />
            </div>
            <div className=" px-3">
               <Group className=" justify-center" mt="md" mb="xs">
                  <Text fw={500} className=" text-center">
                     {data.title}
                  </Text>
               </Group>
               <Text size="sm" c="dimmed" lineClamp={4}>
                  {data.excerpt}
               </Text>
            </div>
         </Card>
      </Link>
   );
};

export default NewsCard;
