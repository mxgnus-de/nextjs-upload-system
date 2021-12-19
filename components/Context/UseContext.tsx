import React from 'react';
import { ErrorWidgitProvider } from 'components/Context/ErrorWidgitContext';
import { SuccessWidgitProvider } from 'components/Context/SuccessWidgitContext';

export interface ContextProps {
   children?: any;
}

function UseContext(props: ContextProps) {
   return (
      <ErrorWidgitProvider>
         <SuccessWidgitProvider>{props.children}</SuccessWidgitProvider>
      </ErrorWidgitProvider>
   );
}

export default UseContext;
