import React from 'react';
import { ErrorWidgetProvider } from 'components/Context/ErrorWidgetContext';
import { SuccessWidgetProvider } from 'components/Context/SuccessWidgetContext';
import { CookiesProvider } from 'react-cookie';
import { SidebarStatusProvider } from './SidebarStatusContext';
import { HasteProvider } from './HasteContext';
import { BackgroundProvider } from './BackgroundContext';

export interface ContextProps {
   children?: any;
}

function UseContext(props: ContextProps) {
   return (
      <CookiesProvider>
         <BackgroundProvider>
            <ErrorWidgetProvider>
               <SuccessWidgetProvider>
                  <SidebarStatusProvider>
                     <HasteProvider>{props.children}</HasteProvider>
                  </SidebarStatusProvider>
               </SuccessWidgetProvider>
            </ErrorWidgetProvider>
         </BackgroundProvider>
      </CookiesProvider>
   );
}

export default UseContext;
