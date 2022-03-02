import styled from 'styled-components';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Link from 'next/link';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArticleIcon from '@mui/icons-material/Article';
import { useHasteUpdate } from 'components/Context/HasteContext';
import { useEffect } from 'react';

function Widget({
   canSave,
   canCopy,
   hasteID,
}: {
   canSave: boolean;
   canCopy: boolean;
   hasteID?: string;
}) {
   const updateErrorWidget = useErrorWidgetUpdate();
   const updateHaste = useHasteUpdate();

   useEffect(() => {
      updateHaste?.setSettings({
         canSave,
         canCopy,
         hasteID: hasteID || null,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <WidgetWrapper>
         <WidgetHeader>
            <Link href='/haste' passHref>
               <WidgetHeaderTitle>Haste</WidgetHeaderTitle>
            </Link>
         </WidgetHeader>
         <WidgetBody>
            {canSave ? (
               <WidgetButton
                  onClick={() => {
                     updateHaste?.uploadHaste();
                  }}
               >
                  <SaveAsIcon />
               </WidgetButton>
            ) : null}
            {canCopy ? (
               <WidgetButton
                  onClick={() => {
                     updateHaste?.copyHaste(hasteID || '');
                  }}
               >
                  <FileCopyIcon />
               </WidgetButton>
            ) : null}

            <WidgetButton
               onClick={() => {
                  updateHaste?.createNewHaste();
               }}
            >
               <NoteAddIcon />
            </WidgetButton>
            {hasteID ? (
               <WidgetButton
                  onClick={() => {
                     updateHaste?.showRowHaste(hasteID || '');
                  }}
               >
                  <ArticleIcon />
               </WidgetButton>
            ) : null}
         </WidgetBody>
      </WidgetWrapper>
   );
}

const WidgetWrapper = styled.div`
   position: fixed;
   top: 0;
   right: 0;
   display: flex;
   flex-direction: column;
   background-color: rgb(6, 40, 48);
   padding: 1rem;
   gap: 0.5rem;
   border-radius: 0 0 0 5px;
   min-width: 150px;
`;

const WidgetHeader = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   text-align: center;
`;

const WidgetHeaderTitle = styled.div`
   color: #fff;
   font-size: 1.5rem;
   font-weight: bold;
   user-select: none;
   cursor: pointer;
`;

const WidgetBody = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 0.5rem;
`;

const WidgetButton = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 0.2rem 1rem;
   border-radius: 0.5rem;
   border: 1px solid #fff;
   cursor: pointer;
   svg path {
      transition: opacity 0.2s ease-in-out;
      fill: #a3a3a3;
      opacity: 0.5;
   }

   &:hover {
      svg path {
         opacity: 1;
      }
   }
`;

export default Widget;
