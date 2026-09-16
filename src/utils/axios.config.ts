import axios from 'axios';

export const misApi = axios.create({
   baseURL: process.env.NEXT_PUBLIC_MIS_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});
