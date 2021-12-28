import axiosClient from 'api/axiosClient';
import Container from 'components/Container/Container';
import Hyphen from 'components/Hyphen/Hyphen';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import FileUpload from 'components/Dashboard/FileUpload';
import ShortURL from 'components/Dashboard/ShortedURL';
import Users from 'components/Dashboard/Users';

export interface Uploads {
   name: string;
   filename: string;
   originalfilename: string;
   path: string;
   mimetype: string;
}

export interface ShortURL {
   name: string;
   url: string;
}

export interface User {
   key: string;
   username: string;
}
interface SiteProps {
   uploads: Uploads[];
   shortedURLs: ShortURL[];
   initalusers: User[];
}

const Dashboard: NextPage<SiteProps> = ({
   uploads,
   shortedURLs,
   initalusers,
}) => {
   const [uploadFiles, setUploadFiles] = useState<typeof uploads>(uploads);
   const [shortedURL, setShortedURL] =
      useState<typeof shortedURLs>(shortedURLs);
   const [users, setUsers] = useState<typeof initalusers>(initalusers);
   const [currentDashboard, setCurrentDashboard] = useState<
      'files' | 'links' | 'users'
   >('files');
   const [search, setSearch] = useState('');
   useEffect(() => {
      setUploadFiles(uploads);
      setShortedURL(shortedURLs);
      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);
      const site = Router.query.site as string | undefined;

      if (site === 'files') setCurrentDashboard('files');
      else if (site === 'links') setCurrentDashboard('links');
      else if (site === 'users') setCurrentDashboard('users');

      Router.replace('/dashboard', undefined, { shallow: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [shortedURLs, uploads]);

   function searchChange(searchID: string) {
      if (searchID) {
         setUploadFiles(
            uploads.filter((upload) =>
               upload.name.toLowerCase().startsWith(searchID),
            ),
         );
         setShortedURL(
            shortedURLs.filter((upload) =>
               upload.name.toLowerCase().startsWith(searchID),
            ),
         );
      }
      if (searchID === '') {
         setUploadFiles(uploads);
         setShortedURL(shortedURLs);
      }
      setSearch(searchID);
   }
   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Dashboard',
            }}
         />
         <Navbar />
         <Container style={{ margin: '50px 0' }}>
            <h1
               className='pointer'
               onClick={() => {
                  currentDashboard === 'files'
                     ? setCurrentDashboard('links')
                     : currentDashboard === 'links'
                     ? setCurrentDashboard('users')
                     : setCurrentDashboard('files');
               }}
            >
               Dashboard - {currentDashboard}
            </h1>
            <Hyphen className='text-muted' />
            <SearchWrapper>
               <div>
                  <input
                     type='text'
                     value={search}
                     placeholder='Search'
                     onChange={(e) => {
                        searchChange(e.target.value);
                     }}
                  />
                  <CloseIcon
                     className='pointer'
                     onClick={() => searchChange('')}
                  />
               </div>
            </SearchWrapper>
            <DashboardWrapper>
               {currentDashboard === 'files' ? (
                  <FileUpload
                     setUploadFiles={setUploadFiles}
                     uploadFiles={uploadFiles}
                  />
               ) : currentDashboard === 'links' ? (
                  <ShortURL
                     setShortedURL={setShortedURL}
                     shortedURL={shortedURL}
                  />
               ) : currentDashboard === 'users' ? (
                  <Users setUsers={setUsers} users={users} />
               ) : (
                  <h1>No dashboard</h1>
               )}
            </DashboardWrapper>
         </Container>
      </>
   );
};

const SearchWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin: 0.4rem 0;
   background-color: #fff;
   border-radius: 0.5rem;

   input {
      border: none;
      font-size: 1.2rem;
   }

   div {
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      * {
         padding: 0.3rem;
      }

      svg {
         path {
            color: #767676;
         }
         height: 2rem;
         width: 2rem;
      }
   }
`;

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const uploads = await axiosClient
      .get(server + '/api/dashboard/uploads', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch();
   const uploadData = uploads.data;

   const shortedURLs = await axiosClient
      .get(server + '/api/dashboard/shorts', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch();
   const shortedURLsData = shortedURLs.data;

   const users = await axiosClient
      .get(server + '/api/dashboard/users', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch();
   const usersData = users.data;

   return {
      props: {
         uploads: uploadData,
         shortedURLs: shortedURLsData,
         initalusers: usersData,
      },
   };
};

export default Dashboard;
