import React from 'react';
import { ErrorWidgitProvider } from 'components/Context/ErrorWidgitContext';
import { SuccessWidgitProvider } from 'components/Context/SuccessWidgitContext';
import { CookiesProvider } from 'react-cookie';

export interface ContextProps {
   children?: any;
}

function UseContext(props: ContextProps) {
   return (
      <CookiesProvider>
         <ErrorWidgitProvider>
            <SuccessWidgitProvider>{props.children}</SuccessWidgitProvider>
         </ErrorWidgitProvider>
      </CookiesProvider>
   );
}

export default UseContext;
