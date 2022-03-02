import React, { useState, useContext, createContext } from 'react';
import SuccessWidget from 'components/Widgets/SuccessWidget/SuccessWidget';

export interface SuccessWidgetProviderProps {
   children?: any;
}

export interface SuccessWidget {
   show: boolean;
   message: string;
}

export interface SuccessWidgetUpdate {
   setSuccessWidget: (show: boolean, message: string) => void;
   showSuccessWidget: (message: string) => void;
}

const SuccessWidgetContext = createContext<SuccessWidget>({
   show: false,
   message: '',
});
const SuccessWidgetUpdateContext = createContext<
   SuccessWidgetUpdate | undefined
>(undefined);

export function useSuccessWidget() {
   return useContext(SuccessWidgetContext);
}

export function useSuccessWidgetUpdate() {
   return useContext(SuccessWidgetUpdateContext);
}

export function SuccessWidgetProvider(props: SuccessWidgetProviderProps) {
   const [success, setSuccess] = useState({ show: false, message: '' });

   function setSuccessWidget(show: boolean, message: string): void {
      setSuccess({ show, message });
   }

   function showSuccessWidget(message: string): void {
      setSuccess({ show: true, message });

      setTimeout(() => {
         setSuccess({ show: false, message: '' });
      }, 3000);
   }

   return (
      <SuccessWidgetContext.Provider value={success}>
         <SuccessWidgetUpdateContext.Provider
            value={{ setSuccessWidget, showSuccessWidget }}
         >
            {props.children}
            {success.show === true && success.message !== '' ? (
               <SuccessWidget text={success.message} />
            ) : (
               ''
            )}
         </SuccessWidgetUpdateContext.Provider>
      </SuccessWidgetContext.Provider>
   );
}
