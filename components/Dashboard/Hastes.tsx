import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import Router from 'next/router';
import capitalizeFirstLetter from 'utils/capitalizeFirstLetter';
import { HasteOwner } from 'types/Dashboard';
import DashboardInfo from './DashboardInfo';
import Link from 'next/link';
import { server } from 'config/api';

function Users({
   hastes,
   setHastes,
}: {
   hastes: HasteOwner[];
   setHastes: any;
}) {
   function createHaste() {
      Router.push('/haste');
   }

   return (
      <>
         {hastes?.length ? (
            hastes.map((haste, index) => {
               return (
                  <Haste
                     key={index}
                     haste={{
                        ...haste,
                        setHastes,
                     }}
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

interface HasteProps extends HasteOwner {
   setHastes: any;
}

function Haste({ haste }: { haste: HasteProps }) {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();

   function deleteHaste(id: string) {
      const confirm = window.confirm(`Are you sure you want to delete ${id}?`);

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/haste?id=${id}`)
            .then(async (res) => {
               updateSuccessWidget?.showSuccessWidget(`${id} deleted`);
               haste.setHastes((prev: HasteOwner[]) =>
                  prev.filter((h) => h.id !== id),
               );
            })
            .catch((error: AxiosError) => {
               updateErrorWidget?.showErrorWidget(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{haste.id}</DashboardName>
         <DashboardInfo>
            {haste.ownerName ? (
               <Link href={'/dashboard/users#' + haste.ownerId}>
                  {haste.ownerName}
               </Link>
            ) : (
               'Unknown'
            )}
         </DashboardInfo>
         <DashboardInfo>
            {haste.language ? capitalizeFirstLetter(haste.language) : 'Unknown'}
         </DashboardInfo>

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
                  Router.push(`/api/haste/${haste.id}/raw`);
               }}
            >
               Raw
            </button>
            <button
               className='button button-blue'
               onClick={(e) => {
                  Router.push(`/api/haste/${haste.id}/json`);
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
