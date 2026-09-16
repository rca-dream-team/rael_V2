import { sanityClient } from '@/sanity/sanity.client';
import { Select, SelectProps } from '@mantine/core';
import React, { useEffect } from 'react';

interface Props extends Omit<SelectProps, 'data'> {
   handleChange?: (e: string | null) => void;
   label: string;
   value?: string;
   data?: SelectProps['data'];
}

const PromFilter = ({ handleChange, label, value, data, ...rest }: Props) => {
   const [selectData, setSelectData] = React.useState<any[]>([]);
   const [_value, setValue] = React.useState(value);
   const [loading, setLoading] = React.useState(false);

   const getPromData = async () => {
      setLoading(true);
      try {
         const data: any[] = await sanityClient.fetch(`*[_type == 'promotion']`);
         setSelectData(data.map((d) => d.name));
      } catch (error) {
         console.error('Error getting prom data', error);
      }
      setLoading(false);
   };

   React.useEffect(() => {
      getPromData();
   }, []);
   //console.log('value', value);

   useEffect(() => {
      if (!value) return;
      const selected = selectData?.find((item) => item === value);
      //console.log('selected', selected);
      if (selected) {
         setValue(selected);
      }
   }, [value, selectData]);
   return (
      <div className="flex flex-col">
         <p className="px-1 text-sm">{label} (Prom): </p>
         <Select
            placeholder={`${label} Promotion`}
            // defaultValue={_value}
            value={_value}
            disabled={loading}
            data={data ?? loading ? ['Loading..'] : selectData}
            searchable
            onChange={(value) => {
               setValue(value as string);
               // if (!value) return;
               handleChange?.(value);
            }}
            allowDeselect
            {...rest}
         />
      </div>
   );
};

export default PromFilter;
