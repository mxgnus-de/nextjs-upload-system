import React, { useState, useContext, createContext } from 'react';
import SuccessWidgit from 'components/Widgits/SuccessWidgit/SuccessWidgit';

export interface SuccessWidgitProviderProps {
   children?: any;
}

export interface SuccessWidgit {
   show: boolean;
   message: string;
}

export interface SuccessWidgitUpdate {
   setSuccessWidgit: (show: boolean, message: string) => void;
   showSuccessWidgit: (message: string) => void;
}

const SuccessWidgitContext = createContext<SuccessWidgit>({
   show: false,
   message: '',
});
const SuccessWidgitUpdateContext = createContext<
   SuccessWidgitUpdate | undefined
>(undefined);

export function useSuccessWidgit() {
   return useContext(SuccessWidgitContext);
}

export function useSuccessWidgitUpdate() {
   return useContext(SuccessWidgitUpdateContext);
}

export function SuccessWidgitProvider(props: SuccessWidgitProviderProps) {
   const [success, setSuccess] = useState({ show: false, message: '' });

   function setSuccessWidgit(show: boolean, message: string): void {
      setSuccess({ show, message });
   }

   function showSuccessWidgit(message: string): void {
      setSuccess({ show: true, message });

      setTimeout(() => {
         setSuccess({ show: false, message: '' });
      }, 3000);
   }

   return (
      <SuccessWidgitContext.Provider value={success}>
         <SuccessWidgitUpdateContext.Provider
            value={{ setSuccessWidgit, showSuccessWidgit }}
         >
            {props.children}
            {success.show === true && success.message !== '' ? (
               <SuccessWidgit text={success.message} />
            ) : (
               ''
            )}
         </SuccessWidgitUpdateContext.Provider>
      </SuccessWidgitContext.Provider>
   );
}
