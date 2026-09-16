'use client';
import React, { useContext } from 'react';
import { Next13ProgressBar } from 'next13-progressbar';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

interface AppContextProps {
   toggleTheme?: () => void;
   isDarkTheme?: boolean | null;
}

const appContextDefaultValues: AppContextProps = {
   toggleTheme: () => {},
};

const AppContext = React.createContext<AppContextProps>(appContextDefaultValues);

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
   const [isDarkTheme, setIsDarkTheme] = React.useState<boolean | null>(null);

   const setIsDarkThemeAsync = () => {
      setIsDarkTheme(null);
      setTimeout(() => {
         setIsDarkTheme(!isDarkTheme);
      }, 500);
   };

   const toggleTheme = () => {
      setIsDarkThemeAsync();

      // if (pathname?.includes("/timeline")) {
      //   window.location.reload();
      // }
   };

   React.useEffect(() => {
      //console.log('isDark', isDarkTheme);
      if (isDarkTheme === null) return;
      const htmlElement = document.querySelector('html');
      if (isDarkTheme) {
         htmlElement?.classList.add('dark');
      } else {
         htmlElement?.classList.remove('dark');
      }
      window.localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
   }, [isDarkTheme]);

   // set theme saved in local storage
   React.useEffect(() => {
      const theme = window.localStorage.getItem('theme');
      //console.log('theme', theme);

      if (theme === 'dark') {
         //console.log('isDark saved');
         setIsDarkTheme(true);
      } else if (theme === 'light') {
         //console.log('light saved');
         setIsDarkTheme(false);
      } else {
         //console.log('syatem');
         setIsDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
   }, []);

   return (
      <AppContext.Provider value={{ toggleTheme, isDarkTheme }}>
         <MantineProvider
            theme={{
               colors: {
                  brand: [
                     '#1f1e1e',
                     '#1f1e1e',
                     '#1f1e1e',
                     '#1f1e1e',
                     '#1f1e1e',
                     '#1f1e1e',
                     '#000',
                     '#000010',
                     '#1f1e1e',
                     '#1f1e1e',
                  ],
               },
               primaryColor: 'brand',
               colorScheme: isDarkTheme ? 'dark' : 'light',
            }}
         >
            <Notifications position="top-right" />

            {children}
         </MantineProvider>
         {isDarkTheme !== null && <Next13ProgressBar color={isDarkTheme ? '#fff' : '#000'} />}
      </AppContext.Provider>
   );
};

export default AppProvider;
