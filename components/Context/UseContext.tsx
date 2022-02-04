import React from 'react';
import { ErrorWidgitProvider } from 'components/Context/ErrorWidgitContext';
import { SuccessWidgitProvider } from 'components/Context/SuccessWidgitContext';
import { CookiesProvider } from 'react-cookie';
import { SidebarStatusProvider } from './SidebarStatusContext';
import { HasteProvider } from './HasteContext';

export interface ContextProps {
   children?: any;
}

function UseContext(props: ContextProps) {
   return (
      <CookiesProvider>
         <ErrorWidgitProvider>
            <SuccessWidgitProvider>
               <SidebarStatusProvider>
                  <HasteProvider>{props.children}</HasteProvider>
               </SidebarStatusProvider>
            </SuccessWidgitProvider>
         </ErrorWidgitProvider>
      </CookiesProvider>
   );
}

export default UseContext;
