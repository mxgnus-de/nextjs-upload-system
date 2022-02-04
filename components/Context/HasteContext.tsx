import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { server } from 'config/api';
import Router from 'next/router';
import React, {
   useState,
   useContext,
   createContext,
   KeyboardEvent,
   RefObject,
   useEffect,
} from 'react';
import { useErrorWidgitUpdate } from './ErrorWidgitContext';

export interface HasteProviderProps {
   children?: any;
}

export interface HasteUpdate {
   setHaste: (haste: string) => void;
   uploadHaste: () => Promise<string | null>;
   clearHaste: () => void;
   handleKeyDownEvent: (e: KeyboardEvent<HTMLDivElement>) => void;
   handleTextAreaKeyDownEvent: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
   createNewHaste: () => void;
   setTextAreaRef: React.Dispatch<
      React.SetStateAction<RefObject<HTMLTextAreaElement> | null>
   >;
   setSettings: React.Dispatch<
      React.SetStateAction<{
         canSave: boolean;
         canCopy: boolean;
         hasteID: string | null;
      }>
   >;
   copyHaste: (hasteID: string) => void;
   showRowHaste: (hasteID: string) => void;
}

const HasteContext = createContext('');
const HasteUpdateContext = createContext<HasteUpdate | undefined>(undefined);

export function useHaste() {
   return useContext(HasteContext);
}

export function useHasteUpdate() {
   return useContext(HasteUpdateContext);
}

export function HasteProvider(props: HasteProviderProps) {
   const [haste, setHaste] = useState('');
   const [textAreaRef, setTextAreaRef] =
      useState<RefObject<HTMLTextAreaElement> | null>(null);
   const updateErrorWidgit = useErrorWidgitUpdate();
   const [changeCusorPosition, setChangeCursorPosition] = useState<
      number | null
   >(null);
   const [settings, setSettings] = useState<{
      canSave: boolean;
      canCopy: boolean;
      hasteID: string | null;
   }>({
      canSave: false,
      canCopy: false,
      hasteID: null,
   });

   useEffect(() => {
      if (changeCusorPosition) {
         textAreaRef?.current?.setSelectionRange(
            changeCusorPosition,
            changeCusorPosition,
         );
         setChangeCursorPosition(null);
      }
   }, [haste, changeCusorPosition, textAreaRef]);

   async function uploadHaste(): Promise<string | null> {
      if (!settings.canSave) return null;
      if (!haste) {
         updateErrorWidgit?.showErrorWidgit('No haste to upload');
         return null;
      }
      let error = false;
      const response = await axiosClient
         .post(
            '/api/haste/new',
            {
               haste,
            },
            {
               withCredentials: true,
            },
         )
         .catch((err: AxiosError) => {
            error = true;
         });
      if (error || !response?.data || !response.data.hasteID) {
         updateErrorWidgit?.showErrorWidgit('Error uploading haste');
         return null;
      }
      const hasteID = response.data.hasteID;
      if ('clipboard' in navigator) {
         navigator.clipboard
            .writeText(`${server}/haste/${hasteID}`)
            .catch((err) => {});
      }
      Router.push(`/haste/${hasteID}`);

      return response.data.hasteID;
   }

   function clearHaste(): void {
      return setHaste('');
   }

   function createNewHaste(): void {
      setHaste('');
      Router.push('/haste');
      return;
   }

   function copyHaste(hasteID: string): void {
      if (!settings.canCopy)
         return updateErrorWidgit?.showErrorWidgit(
            'You cannot copy this haste',
         );
      if (!hasteID)
         return updateErrorWidgit?.showErrorWidgit('Error copying haste');
      Router.push(`/haste?copy=${hasteID}`);
      return;
   }

   function showRowHaste(hasteID: string) {
      if (!hasteID)
         return updateErrorWidgit?.showErrorWidgit('Cannot show row haste');
      return Router.push(`/haste/${hasteID}/raw`);
   }

   function handleKeyDownEvent(e: KeyboardEvent<HTMLDivElement>): void {
      const char = e.key.toLowerCase();
      const isShortCut = e.ctrlKey;
      const isShift = e.shiftKey;
      if (isShortCut && char === 's' && settings.canSave) {
         e.preventDefault();
         uploadHaste();
         return;
      } else if (isShortCut && char === 'n') {
         e.preventDefault();
         createNewHaste();
         return;
      } else if (isShortCut && char === 'd' && settings.canCopy) {
         e.preventDefault();
         copyHaste(haste);
         return;
      } else if (isShortCut && isShift && char === 'r') {
         showRowHaste(settings.hasteID || '');
      }
   }

   function handleTextAreaKeyDownEvent(e: any): void {
      const char = e.key.toLowerCase();
      if (char === 'tab') {
         e.preventDefault();
         const { selectionStart } = e.target;
         const splitHaste = haste.substring(selectionStart);
         const splitHaste2 = haste.substring(0, selectionStart);
         const newHaste = `${splitHaste2}\t${splitHaste}`;
         setHaste(newHaste);
         const newHasteCursorPosition = newHaste.length - splitHaste.length;
         setChangeCursorPosition(newHasteCursorPosition);
         return;
      }
   }

   return (
      <HasteContext.Provider value={haste}>
         <HasteUpdateContext.Provider
            value={{
               setHaste,
               uploadHaste,
               clearHaste,
               handleKeyDownEvent,
               handleTextAreaKeyDownEvent,
               createNewHaste,
               setTextAreaRef,
               setSettings,
               copyHaste,
               showRowHaste,
            }}
         >
            {props.children}
         </HasteUpdateContext.Provider>
      </HasteContext.Provider>
   );
}
