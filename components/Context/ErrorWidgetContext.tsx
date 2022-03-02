import React, { useState, useContext, createContext } from 'react';
import ErrorWidget from 'components/Widgets/ErrorWidget/ErrorWidget';

export interface ErrorWidgetProviderProps {
   children?: any;
}

export interface ErrorWidgetType {
   show: boolean;
   message: string;
}

export interface ErrorWidgetUpdate {
   setErrorWidget: (show: boolean, message: string) => void;
   showErrorWidget: (message: string) => void;
}

const ErrorWidgetContext = createContext<ErrorWidgetType>({
   show: false,
   message: '',
});
const ErrorWidgetUpdateContext = createContext<ErrorWidgetUpdate | undefined>(
   undefined,
);

export function useErrorWidget() {
   return useContext(ErrorWidgetContext);
}

export function useErrorWidgetUpdate() {
   return useContext(ErrorWidgetUpdateContext);
}

export function ErrorWidgetProvider(props: ErrorWidgetProviderProps) {
   const [errored, setErrored] = useState({ show: false, message: '' });

   function setErrorWidget(show: boolean, message: string): void {
      setErrored({ show, message });
   }

   function showErrorWidget(message: string): void {
      setErrored({ show: true, message });

      setTimeout(() => {
         setErrored({ show: false, message: '' });
      }, 3000);
   }

   return (
      <ErrorWidgetContext.Provider value={errored}>
         <ErrorWidgetUpdateContext.Provider
            value={{ setErrorWidget, showErrorWidget }}
         >
            {props.children}
            {errored.show === true && errored.message !== '' ? (
               <ErrorWidget text={errored.message} />
            ) : (
               ''
            )}
         </ErrorWidgetUpdateContext.Provider>
      </ErrorWidgetContext.Provider>
   );
}
