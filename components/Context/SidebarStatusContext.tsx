import React, { useState, useContext, createContext, useEffect } from 'react';

export interface SidebarStatusProviderProps {
   children?: any;
}

export interface SidebarStatusUpdate {
   setSidebarStatus: (status: boolean) => void;
   toggleSidebarStatus: () => void;
}

const SidebarStatusContext = createContext(false);
const SidebarStatusUpdateContext = createContext<
   SidebarStatusUpdate | undefined
>(undefined);

export function useSidebarStatus() {
   return useContext(SidebarStatusContext);
}

export function useSidebarStatusUpdate() {
   return useContext(SidebarStatusUpdateContext);
}

export function SidebarStatusProvider(props: SidebarStatusProviderProps) {
   const [sidebarStatus, setSidebarStatus] = useState(false);

   useEffect(() => {
      setSidebarStatus(
         localStorage.getItem('sidebarStatus') === 'true' ? true : false,
      );
   }, []);

   useEffect(() => {
      localStorage.setItem('sidebarStatus', sidebarStatus.toString());
   }, [sidebarStatus]);

   function toggleSidebarStatus() {
      setSidebarStatus((prev) => !prev);
   }

   return (
      <SidebarStatusContext.Provider value={sidebarStatus}>
         <SidebarStatusUpdateContext.Provider
            value={{ setSidebarStatus, toggleSidebarStatus }}
         >
            {props.children}
         </SidebarStatusUpdateContext.Provider>
      </SidebarStatusContext.Provider>
   );
}
