import { NumberInput, NumberInputProps, PasswordInput, TextInput, TextInputProps } from '@mantine/core';
import React from 'react';

export const CTextInput = (props: TextInputProps) => {
   return (
      <TextInput
         // className="border-2 w-full border-stone-500 rounded-xl focus:border-black duration-200 p-3.5 px-5"
         sx={{
            '.mantine-Input-input': {
               ':focus': { border: '2px solid #000 !important' },
               padding: (props.sx as any)?.padding ?? '1.5em 0.6em !important',
               fontWeight: 500,
               borderRadius: (props.sx as any)?.borderRadius ?? '0.7em',
               width: '100%',
               fontSize: (props.sx as any)?.fontSize ?? '1em',
               border: '2px solid #78716c',
            },
            width: '100%',
         }}
         {...props}
      />
   );
};

export const CPasswordInput = (props: TextInputProps) => {
   return (
      <PasswordInput
         // className="border-2 w-full border-stone-500 rounded-xl focus:border-black duration-200 p-3.5 px-5"
         sx={{
            '.mantine-Input-input': {
               ':focus': { border: '2px solid #000 !important' },
               padding: (props.sx as any)?.padding ?? '1.5em 0.6em !important',
               fontWeight: 500,
               borderRadius: (props.sx as any)?.borderRadius ?? '0.7em',
               width: '100%',
               fontSize: (props.sx as any)?.fontSize ?? '1em',
               border: '2px solid #78716c',
            },
            '.mantine-PasswordInput-innerInput': {
               height: '100%',
            },
            width: '100%',
         }}
         {...props}
      />
   );
};

export const CNumberInput = (props: NumberInputProps) => {
   return (
      <NumberInput
         sx={{
            '.mantine-Input-input': {
               ':focus': { border: '2px solid #000 !important' },
               padding: (props.sx as any)?.padding ?? '1.5em 0.6em !important',
               fontWeight: 'normal',
               borderRadius: (props.sx as any)?.borderRadius ?? '0.7em',
               width: '100%',
               fontSize: (props.sx as any)?.fontSize ?? '1em',
               border: '2px solid #78716c',
            },
            width: '100%',
         }}
         {...props}
      />
   );
};
