import React, { useState, useContext, createContext } from 'react';
import ErrorWidgit from 'components/Widgits/ErrorWidgit/ErrorWidgit';

export interface ErrorWidgitProviderProps {
   children?: any;
}

export interface ErrorWidgitType {
   show: boolean;
   message: string;
}

export interface ErrorWidgitUpdate {
   setErrorWidgit: (show: boolean, message: string) => void;
   showErrorWidgit: (message: string) => void;
}

const ErrorWidgitContext = createContext<ErrorWidgitType>({
   show: false,
   message: '',
});
const ErrorWidgitUpdateContext = createContext<ErrorWidgitUpdate | undefined>(
   undefined,
);

export function useErrorWidgit() {
   return useContext(ErrorWidgitContext);
}

export function useErrorWidgitUpdate() {
   return useContext(ErrorWidgitUpdateContext);
}

export function ErrorWidgitProvider(props: ErrorWidgitProviderProps) {
   const [errored, setErrored] = useState({ show: false, message: '' });

   function setErrorWidgit(show: boolean, message: string): void {
      setErrored({ show, message });
   }

   function showErrorWidgit(message: string): void {
      setErrored({ show: true, message });

      setTimeout(() => {
         setErrored({ show: false, message: '' });
      }, 3000);
   }

   return (
      <ErrorWidgitContext.Provider value={errored}>
         <ErrorWidgitUpdateContext.Provider
            value={{ setErrorWidgit, showErrorWidgit }}
         >
            {props.children}
            {errored.show === true && errored.message !== '' ? (
               <ErrorWidgit text={errored.message} />
            ) : (
               ''
            )}
         </ErrorWidgitUpdateContext.Provider>
      </ErrorWidgitContext.Provider>
   );
}
