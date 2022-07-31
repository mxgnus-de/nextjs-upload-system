import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import Link from 'next/link';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import { ShorterOwner } from 'types/Dashboard';
import DashboardInfo from './DashboardInfo';
import shortString from 'utils/shortstring';

function ShortURL({
   shortedURL,
   setShortedURL,
}: {
   shortedURL: ShorterOwner[];
   setShortedURL: any;
}) {
   return (
      <>
         {shortedURL?.length ? (
            shortedURL.map((upload, index) => {
               return (
                  <ShortedURL
                     key={index}
                     link={{ ...upload, setShortedURL: setShortedURL }}
                  />
               );
            })
         ) : (
            <>
               <h4 style={{ margin: '10px' }}>No short links yet</h4>
               <Link href='/shorter' passHref>
                  <p
                     className='button button-blue'
                     style={{ marginTop: '5px' }}
                  >
                     Short a url
                  </p>
               </Link>
            </>
         )}
      </>
   );
}

interface ShortedURLProps extends ShorterOwner {
   setShortedURL: any;
}

function ShortedURL({ link }: { link: ShortedURLProps }) {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();
   function deleteShortURL(name: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${name}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/shorts?shorturl=${name}`)
            .then(async () => {
               updateSuccessWidget?.showSuccessWidget(`${name} deleted`);
               const shortURLs = await axiosClient.get(
                  process.env.NEXT_PUBLIC_URL + '/api/dashboard/shorts',
                  {
                     withCredentials: true,
                  },
               );
               if (shortURLs.data) {
                  link.setShortedURL(shortURLs.data);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidget?.showErrorWidget(error.message);
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{link.name}</DashboardName>
         <DashboardInfo>
            {link.ownerName ? (
               <Link href={'/dashboard/users#' + link.ownerId}>
                  {link.ownerName}
               </Link>
            ) : (
               'Unknown'
            )}
         </DashboardInfo>
         <DashboardInfo>{shortString(link.url, 100)}</DashboardInfo>
         <DashboardInfo>{link.views}</DashboardInfo>
         <DashboardButtons>
            <Link href={'/l/' + link.name} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteShortURL(link.name);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default ShortURL;
