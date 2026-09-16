'use client';
import { CPasswordInput, CTextInput } from '@/components/shared/inputs';
import { Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { useState } from 'react';

const SignuPage = () => {
   const [next, setNext] = useState(true);
   const form: any = useForm({
      initialValues: { email: '', password: '', confirmPassword: '' },
      validate: {
         email: (value) => (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid Email'),
         password: (value) =>
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=|{}\[\]:;<>,.?/~])(?!.*\s).{8,}$/.test(value)
               ? null
               : 'A password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number',
         confirmPassword: (value) => (value === form.values.password ? null : 'Passwords do not match'),
      },
      validateInputOnBlur: true,
   });
   const [role, setRole] = useState<string | null>('student');

   return next ? (
      <form onSubmit={form.onSubmit(() => setNext(true))} className={' flex-col w-full flex items-center gap-y-8 font-poppins '}>
         <div className="flex justify-center gap-20 w-full items-center ">
            <Radio
               checked={role === 'staff'}
               onChange={() => setRole('staff')}
               color="black"
               name="role"
               id="box"
               label="Staff/Instructor"
            />
            <Radio
               checked={role === 'student'}
               onChange={() => setRole('student')}
               color="black"
               name="role"
               id="box"
               label="Student"
            />
         </div>
         <input
            className="border-2 w-full border-stone-500 rounded-xl focus:border-black duration-200 p-3.5 px-5"
            type="text"
            placeholder={role === 'student' ? 'Full Names or Student ID' : 'Full Names'}
         />
         <button className="bg-black border-2 border-white hover:border-black truncate stylbtn text-white rounded-[3em] py-3 px-8">
            <p className="z-50 relative">Signup</p>
         </button>
      </form>
   ) : (
      <form className=" flex-col w-full flex items-center gap-y-8 font-poppins  ">
         <CTextInput placeholder="Email" {...form.getInputProps('email')} />
         <CPasswordInput placeholder="Password" {...form.getInputProps('password')} />
         <CPasswordInput placeholder="Confirm Password" {...form.getInputProps('confirmPassword')} />
         <button
            className="bg-black border-2 border-white hover:border-black truncate stylbtn text-white rounded-[3em] py-3 px-8"
            onClick={form.onSubmit(() => setNext(true))}
         >
            <p className="z-50 relative">Next</p>
         </button>
      </form>
   );
};

export default SignuPage;
