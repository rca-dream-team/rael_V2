import { useAuth } from '@/contexts/AuthProvider';
import { sanityClient } from '@/sanity/sanity.client';
import { NewsCategory } from '@/types/news';
import { Center, SegmentedControl } from '@mantine/core';
import React, { useEffect } from 'react';

interface Props {
   // eslint-disable-next-line no-unused-vars
   onChange: (category: NewsCategory) => void;
   value?: string;
   categories?: NewsCategory[];
}

const CategoryChanger = ({ value, onChange }: Props) => {
   const [_value, setValue] = React.useState(value);
   const [categories, setCategories] = React.useState<NewsCategory[]>([]);
   const { user } = useAuth();
   const isStaff = user?._type !== 'student';

   const handleChange = (value: string) => {
      setValue(value);
      const _val = categories.find((cat) => cat._id === value);
      if (!_val) return;
      onChange(_val);
   };

   const getCategories = async () => {
      const data: NewsCategory[] = await sanityClient.fetch(`*[_type == "news-category"]`);
      const _data = isStaff ? data.filter((d) => !d.classified) : data;
      const ordered = _data.sort((a, b) => {
         return (a.order ?? Infinity) - (b.order ?? Infinity);
      });
      //console.log('ordered', ordered);
      setCategories(ordered);
      setValue(value ?? ordered[0]._id);
      const oldCat = _data.find((cat) => cat._id === value);
      onChange(oldCat ?? ordered[0]);
   };

   useEffect(() => {
      getCategories();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <SegmentedControl
         data={categories.map((cat) => ({
            value: cat._id,
            label: (
               <Center title="classified">
                  <p>{cat.name}</p>
               </Center>
            ),
         }))}
         value={_value}
         onChange={handleChange}
      />
   );
};

export default CategoryChanger;
