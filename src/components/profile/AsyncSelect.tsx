/* eslint-disable no-unused-vars */
import { sanityClient } from '@/sanity/sanity.client';
import { capitalize, getObjValue } from '@/utils/funcs';
import { MantineSize, Select } from '@mantine/core';
import { QueryWithoutParams } from 'next-sanity';
import React, { FC, useEffect, useState } from 'react';

interface Props {
   label?: string;
   placeholder?: string;
   value?: string;
   query: string;
   accessorKey?: string;
   /** labelKey is the key of the object to be used as the label ex:
    *  {id: 1,
    *  name: 'John', act: {name: 'name'}} => labelKey = 'name' or 'act.name
    *  */
   labelKey?: string;
   onChange?: (e: any) => void;
   disabled?: boolean;
   variant?: 'unstyled' | 'default' | 'filled' | 'outline';
   width?: number | string;
   setActive?: (data: any) => void;
   useAuth?: boolean;
   setData?: (data: any) => void;
   className?: string;
   px?: number;
   size?: MantineSize;
   required?: boolean;
   /** getLabel is a function that takes the data and returns the label to be displayed */
   getLabel?: (data: any) => string;
   description?: string;
   filterData?: (data: any) => any;
   params?: QueryWithoutParams;
   selectValue?: boolean;
}

const AsyncSelect: FC<Props> = ({
   label,
   labelKey,
   accessorKey,
   placeholder,
   value,
   onChange,
   disabled,
   variant,
   width,
   setActive,
   setData,
   className,
   px,
   size,
   required,
   getLabel,
   description,
   filterData,
   query,
   params,
   selectValue,
}) => {
   const [selected, setSelected] = React.useState(value);
   //console.log('selected', selected);
   const [data, _setData] = useState<any[]>([]);
   const [selectedData, setSelectedData] = React.useState<any[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const dataSet = new Set(data?.map((item) => JSON.stringify(item)));
      const newData = [...dataSet].map((item) => JSON.parse(item));
      setData?.(newData);
      const _data = (filterData ? filterData(newData) : newData) as any[];
      const selectData = _data?.map((item) => ({
         value: String(item[accessorKey ?? 'id']),
         label: getLabel ? getLabel(item) : capitalize(getObjValue(labelKey ?? 'name', item) ?? item[labelKey ?? 'name']),
      }));
      //console.log('selectData', selectData);
      setSelectedData(selectData ?? []);
      const selected = selectValue ? value : _data?.find((item) => item[accessorKey ?? 'id'] === value);
      setActive?.(selected);
      //console.log('selected use', selected?.id);
      if (selected) {
         setSelected(selectValue ? selected : selected.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [accessorKey, data, labelKey, value]);
   const loadingData = [{ value: 'loading', label: 'Loading...', disabled: true }];
   const noData = [{ value: 'no-data', label: 'No data found', disabled: true }];

   useEffect(() => {
      if (!query) return;
      const getData = async () => {
         try {
            const data = await sanityClient.fetch(query, params);
            _setData(data);
         } catch (error) {
            //console.log('err', error);
         }
      };
      getData();
   }, [params, query]);
   return (
      <Select
         label={label}
         required={required}
         placeholder={placeholder}
         variant={variant ?? 'unstyled'}
         px={px ?? 6}
         disabled={disabled}
         description={description}
         // data={loading ? loadingData : selectedData}
         data={loading ? loadingData : data?.length === 0 ? noData : selectedData}
         value={String(selected)}
         nothingFound="No data found"
         width={width ?? 300}
         searchable
         size={size ?? 'sm'}
         onChange={(e) => {
            const selected = data?.find((item) => item[accessorKey ?? 'id'] === e);
            setActive?.(selected);
            // //console.log('e', e);
            setSelected(e!);
            onChange?.(e);
         }}
         className={className}
         allowDeselect
      />
   );
};

export default AsyncSelect;
