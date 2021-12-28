import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import { server } from 'config/api';
import Link from 'next/link';
import { ShortURL as ShortURLs } from 'pages/dashboard';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';

function ShortURL({
   shortedURL,
   setShortedURL,
}: {
   shortedURL: ShortURLs[];
   setShortedURL: any;
}) {
   return (
      <>
         {shortedURL?.length ? (
            shortedURL.map((upload, index) => {
               return (
                  <ShortedURL
                     key={index}
                     name={upload.name}
                     url={upload.url}
                     setShortedURL={setShortedURL}
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

function ShortedURL(shortURL: {
   name: string;
   url: string;
   setShortedURL: any;
}) {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();
   function deleteShortURL(name: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${name}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/shorts?shorturl=${name}`)
            .then(async () => {
               updateSuccessWidgit?.showSuccessWidgit(`${name} deleted`);
               const shortURLs = await axiosClient.get(
                  server + '/api/dashboard/shorts',
                  {
                     withCredentials: true,
                  },
               );
               if (shortURLs.data) {
                  shortURL.setShortedURL(shortURLs.data);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(error.message);
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{shortURL.name}</DashboardName>
         <div>{shortURL.url}</div>
         <DashboardButtons>
            <Link href={'/links/' + shortURL.name} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteShortURL(shortURL.name);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default ShortURL;
