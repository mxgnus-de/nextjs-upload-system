import styled from 'styled-components';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Link from 'next/link';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArticleIcon from '@mui/icons-material/Article';
import { useHasteUpdate } from 'components/Context/HasteContext';
import { useEffect } from 'react';

function Widgit({
   canSave,
   canCopy,
   hasteID,
}: {
   canSave: boolean;
   canCopy: boolean;
   hasteID?: string;
}) {
   const updateErrorWidgit = useErrorWidgitUpdate();
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
      <WidgitWrapper>
         <WidgitHeader>
            <Link href='/haste' passHref>
               <WidgitHeaderTitle>Haste</WidgitHeaderTitle>
            </Link>
         </WidgitHeader>
         <WidgitBody>
            {canSave ? (
               <WidgitButton
                  onClick={() => {
                     updateHaste?.uploadHaste();
                  }}
               >
                  <SaveAsIcon />
               </WidgitButton>
            ) : null}
            {canCopy ? (
               <WidgitButton
                  onClick={() => {
                     updateHaste?.copyHaste(hasteID || '');
                  }}
               >
                  <FileCopyIcon />
               </WidgitButton>
            ) : null}

            <WidgitButton
               onClick={() => {
                  updateHaste?.createNewHaste();
               }}
            >
               <NoteAddIcon />
            </WidgitButton>
            {hasteID ? (
               <WidgitButton
                  onClick={() => {
                     updateHaste?.showRowHaste(hasteID || '');
                  }}
               >
                  <ArticleIcon />
               </WidgitButton>
            ) : null}
         </WidgitBody>
      </WidgitWrapper>
   );
}

const WidgitWrapper = styled.div`
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

const WidgitHeader = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   text-align: center;
`;

const WidgitHeaderTitle = styled.div`
   color: #fff;
   font-size: 1.5rem;
   font-weight: bold;
   user-select: none;
   cursor: pointer;
`;

const WidgitBody = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 0.5rem;
`;

const WidgitButton = styled.div`
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

export default Widgit;
