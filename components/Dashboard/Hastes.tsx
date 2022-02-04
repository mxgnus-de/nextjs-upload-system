import axiosClient from 'api/axiosClient';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import { server } from 'config/api';
import { Haste as IHaste } from 'types/Dashboard';
import { useCookies } from 'react-cookie';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import Router from 'next/router';
import capitalizeFirstLetter from 'api/utils/capitalizeFirstLetter';

function Users({ hastes, setHastes }: { hastes: IHaste[]; setHastes: any }) {
   function createHaste() {
      Router.push('/haste');
   }

   return (
      <>
         {hastes?.length ? (
            hastes.map((haste, index) => {
               return (
                  <User
                     key={index}
                     setHastes={setHastes}
                     id={haste.id}
                     language={haste.language}
                     haste={haste.haste}
                  />
               );
            })
         ) : (
            <>
               <h4 style={{ margin: '10px' }}>No hastes created yet</h4>
               <button
                  className='button button-blue'
                  onClick={(e) => {
                     createHaste();
                  }}
               >
                  Create Haste
               </button>
            </>
         )}
      </>
   );
}

function User(haste: {
   id: string;
   language: string | null;
   haste: string;
   setHastes: any;
}) {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();
   const [cookies, setCookies, removeCookies] = useCookies(['upload_key']);

   function deleteHaste(id: string) {
      const confirm = window.confirm(`Are you sure you want to delete ${id}?`);

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/haste?id=${id}`)
            .then(async (res) => {
               updateSuccessWidgit?.showSuccessWidgit(`${id} deleted`);
               console.log(res);
               if (res.data.hastes) {
                  haste.setHastes(res.data.hastes);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{haste.id}</DashboardName>
         <div>
            {haste.language ? capitalizeFirstLetter(haste.language) : 'Unknown'}
         </div>

         <DashboardButtons>
            <button
               className='button button-green'
               onClick={(e) => {
                  Router.push(`/haste/${haste.id}`);
               }}
            >
               View
            </button>
            <button
               className='button button-blue'
               onClick={(e) => {
                  Router.push(`/haste/${haste.id}/raw`);
               }}
            >
               Raw
            </button>
            <button
               className='button button-blue'
               onClick={(e) => {
                  Router.push(`/haste/${haste.id}/json`);
               }}
            >
               JSON
            </button>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteHaste(haste.id);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default Users;
