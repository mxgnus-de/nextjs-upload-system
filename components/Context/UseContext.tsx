import React from 'react';
import { ErrorWidgitProvider } from 'components/Context/ErrorWidgitContext';
import { SuccessWidgitProvider } from 'components/Context/SuccessWidgitContext';
import { CookiesProvider } from 'react-cookie';
import { CurrentDashboardPageProvider } from './CurrentDashboardPage';
import { SidebarStatusProvider } from './SidebarStatusContext';

export interface ContextProps {
   children?: any;
}

function UseContext(props: ContextProps) {
   return (
      <CookiesProvider>
         <ErrorWidgitProvider>
            <SuccessWidgitProvider>
               <CurrentDashboardPageProvider>
                  <SidebarStatusProvider>
                     {props.children}
                  </SidebarStatusProvider>
               </CurrentDashboardPageProvider>
            </SuccessWidgitProvider>
         </ErrorWidgitProvider>
      </CookiesProvider>
   );
}

export default UseContext;
