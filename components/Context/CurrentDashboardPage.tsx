import React, { useState, useContext, createContext, useEffect } from 'react';
import DashboardPages from 'types/DashboardPages';

export interface CurrentDashboardPageProviderProps {
   children?: any;
}

export interface CurrentDashboardPageUpdate {
   setCurrentDashboardPage: (page: DashboardPages) => void;
}

const CurrentDashboardPageContext = createContext('');
const CurrentDashboardPageUpdateContext = createContext<
   CurrentDashboardPageUpdate | undefined
>(undefined);

export function useCurrentDashboardPage() {
   return useContext(CurrentDashboardPageContext);
}

export function useCurrentDashboardPageUpdate() {
   return useContext(CurrentDashboardPageUpdateContext);
}

export function CurrentDashboardPageProvider(
   props: CurrentDashboardPageProviderProps,
) {
   const [currentDashboardPageLocal, setCurrentDashboardPageLocal] =
      useState<DashboardPages>('files');

   useEffect(() => {
      const localStorageDashboardPage = localStorage.getItem('dashboardpage');
      if (localStorageDashboardPage) {
         const dashboardpages: DashboardPages[] = [
            'files',
            'links',
            'users',
            'settings',
         ];
         dashboardpages.forEach((dashboardpage) => {
            if (localStorageDashboardPage === dashboardpage) {
               setCurrentDashboardPage(dashboardpage);
            }
         });
      }
   }, []);

   function setCurrentDashboardPage(page: DashboardPages) {
      setCurrentDashboardPageLocal(page);
      localStorage.setItem('dashboardpage', page);
   }

   return (
      <CurrentDashboardPageContext.Provider value={currentDashboardPageLocal}>
         <CurrentDashboardPageUpdateContext.Provider
            value={{ setCurrentDashboardPage }}
         >
            {props.children}
         </CurrentDashboardPageUpdateContext.Provider>
      </CurrentDashboardPageContext.Provider>
   );
}
