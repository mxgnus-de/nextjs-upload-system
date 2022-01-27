import styled from 'styled-components';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Link from 'next/link';
import Router from 'next/router';
import axiosClient from '../../../api/axiosClient';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { AxiosError } from 'axios';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { server } from 'config/api';

function Widgit({
   hasteValue,
   setHasteValue,
   canSave,
   canCopy,
   hasteID,
}: {
   hasteValue: string;
   setHasteValue?: (value: string) => void;
   canSave: boolean;
   canCopy: boolean;
   hasteID?: string;
}) {
   const updateErrorWidgit = useErrorWidgitUpdate();

   function clearHasteValue() {
      setHasteValue?.('');
   }

   async function uploadHaste() {
      if (!hasteValue)
         return updateErrorWidgit?.showErrorWidgit('No haste to upload');
      let error = false;
      const response = await axiosClient
         .post(
            '/api/haste/new',
            {
               haste: hasteValue,
            },
            {
               withCredentials: true,
            },
         )
         .catch((err: AxiosError) => {
            updateErrorWidgit?.showErrorWidgit('Error uploading haste');
            error = true;
            return;
         });
      if (error || !response?.data) return;
      if (!response.data.hasteID) {
         return updateErrorWidgit?.showErrorWidgit('Error uploading haste');
      }
      if ('clipboard' in navigator) {
         navigator.clipboard
            .writeText(`${server}/haste/${response.data.hasteID}`)
            .catch((err) => {});
      }
      Router.push(`/haste/${response.data.hasteID}`);
   }

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
                     uploadHaste();
                  }}
               >
                  <SaveAsIcon />
               </WidgitButton>
            ) : null}
            {canCopy ? (
               <WidgitButton
                  onClick={() => {
                     if (!hasteID)
                        return updateErrorWidgit?.showErrorWidgit(
                           'Error copying haste',
                        );
                     Router.push(`/haste?copy=${hasteID}`);
                  }}
               >
                  <FileCopyIcon />
               </WidgitButton>
            ) : null}

            <WidgitButton
               onClick={() => {
                  clearHasteValue();
                  Router.push('/haste');
               }}
            >
               <NoteAddIcon />
            </WidgitButton>
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
