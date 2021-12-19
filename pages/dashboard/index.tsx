import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import Container from 'components/Container/Container';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import Hyphen from 'components/Hyphen/Hyphen';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import Wrapper from 'components/Wrapper/Wrapper';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface SiteProps {
   uploads: {
      name: string;
      filename: string;
      originalfilename: string;
      path: string;
      mimetype: string;
   }[];
   shortedURLs: {
      name: string;
      url: string;
   }[];
}

const Dashboard: NextPage<SiteProps> = ({ uploads, shortedURLs }) => {
   const [uploadFiles, setUploadFiles] = useState<typeof uploads>();
   const [shortedURL, setShortedURL] = useState<typeof shortedURLs>();
   const [currentDashboard, setCurrentDashboard] = useState<'files' | 'links'>(
      'files',
   );
   useEffect(() => {
      setUploadFiles(uploads);
      setShortedURL(shortedURLs);
   }, [shortedURLs, uploads]);
   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Dashboard',
            }}
         />
         <Navbar />
         <Container>
            <h1
               className='pointer'
               onClick={() => {
                  currentDashboard === 'files'
                     ? setCurrentDashboard('links')
                     : setCurrentDashboard('files');
               }}
            >
               Dashboard - {currentDashboard}
            </h1>
            <Hyphen className='text-muted' />
            <Wrapper>
               {currentDashboard === 'files' ? (
                  uploadFiles?.length ? (
                     uploadFiles.map((upload, index) => {
                        return (
                           <Upload
                              key={index}
                              name={upload.name}
                              filename={upload.filename}
                              originalFilename={upload.originalfilename}
                              path={upload.path}
                              mimetype={upload.mimetype}
                              setUploadFiles={setUploadFiles}
                           />
                        );
                     })
                  ) : (
                     <>
                        <h4>No uploads yet</h4>
                        <Link href='/' passHref>
                           <p
                              className='button button-blue'
                              style={{ marginTop: '5px' }}
                           >
                              Upload something
                           </p>
                        </Link>
                     </>
                  )
               ) : shortedURL?.length ? (
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
                     <h4>No short links yet</h4>
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
            </Wrapper>
         </Container>
      </>
   );
};

const Upload = (upload: {
   name: string;
   filename: string;
   originalFilename: string;
   path: string;
   mimetype: string;
   setUploadFiles: any;
}) => {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();
   function deleteUpload(name: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${name}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/uploads?filename=${name}`)
            .then(async () => {
               updateSuccessWidgit?.showSuccessWidgit(`${name} deleted`);
               const uploads = await axiosClient.get(
                  server + '/api/dashboard/uploads',
                  {
                     withCredentials: true,
                  },
               );
               if (uploads.data) {
                  upload.setUploadFiles(uploads.data);
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
      <DashboardWrapper>
         <DashboardName>{upload.name}</DashboardName>
         <DashboardOriginalName>
            {upload.originalFilename}
         </DashboardOriginalName>
         <DashboardButtons>
            <Link href={'/' + upload.name} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteUpload(upload.name);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardWrapper>
   );
};

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
      <DashboardWrapper>
         <DashboardName>{shortURL.name}</DashboardName>
         <DashboardOriginalName>{shortURL.url}</DashboardOriginalName>
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
      </DashboardWrapper>
   );
}
{
}

const DashboardWrapper = styled.div`
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;
   min-width: 50%;
   margin: 0.4rem 0;
   background-color: #26282b;
   border-radius: 0.5rem;
   padding: 1rem;
`;

const DashboardName = styled.div`
   display: flex;
`;

const DashboardButtons = styled.div`
   display: flex;

   * {
      margin: 0 0.2rem;
   }
`;

const DashboardOriginalName = styled.div``;

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const uploads = await axiosClient.get(server + '/api/dashboard/uploads', {
      headers: {
         authorization: context.req.cookies['upload_key'] || '',
      },
   });
   const uploadData = uploads.data;

   const shortedURLs = await axiosClient.get(server + '/api/dashboard/shorts', {
      headers: {
         authorization: context.req.cookies['upload_key'] || '',
      },
   });
   const shortedURLsData = shortedURLs.data;

   return {
      props: {
         uploads: uploadData,
         shortedURLs: shortedURLsData,
      },
   };
};

export default Dashboard;
