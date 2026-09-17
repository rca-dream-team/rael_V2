import { NewsCategory } from '@/types/news';
import { Center, SegmentedControl } from '@mantine/core';
import React, { useEffect } from 'react';

interface Props {
   // eslint-disable-next-line no-unused-vars
   onChange: (category: NewsCategory) => void;
   value?: string;
   categories?: NewsCategory[];
}

const CategoryChanger = ({ value, onChange, categories = [] }: Props) => {
   const [_value, setValue] = React.useState(value || categories[0]?._id);

   const handleChange = (selectedId: string) => {
      setValue(selectedId);
      const _val = categories.find((cat) => cat._id === selectedId);
      if (!_val) return;
      onChange(_val);
   };

   useEffect(() => {
      if (categories.length === 0) return;

      // If current value is valid in categories, ensure it's selected
      const currentCat = categories.find((cat) => cat._id === value);
      if (currentCat) {
         setValue(currentCat._id);
      } else {
         // Default to the first category if current value is invalid or unset
         setValue(categories[0]._id);
         onChange(categories[0]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [categories, value]);

   if (categories.length === 0) {
      return null;
   }

   return (
      <SegmentedControl
         data={categories.map((cat) => ({
            value: cat._id,
            label: (
               <Center title={cat.name}>
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
