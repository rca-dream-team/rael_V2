/* eslint-disable no-unused-vars */
'use client';

import { cn } from '@/utils/cn';
import { Button, ButtonProps } from '@mantine/core';
import { useFormStatus } from 'react-dom';

interface Props extends ButtonProps {}

export function SubmitButton(props: Props) {
   const { children, disabled, type, className, ...rest } = props;
   const { pending } = useFormStatus();

   return (
      <Button
         type="submit"
         disabled={pending}
         loading={pending}
         className={cn('bg-black text-white dark:bg-white dark:text-black self-center', className)}
         {...rest}
      >
         {children}
      </Button>
   );
}
