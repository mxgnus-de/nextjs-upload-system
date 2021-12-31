import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
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
import Notification from 'types/Notification';
import Layout from 'components/Layout/Layout';
import {
   useCurrentDashboardPage,
   useCurrentDashboardPageUpdate,
} from 'components/Context/CurrentDashboardPage';
import {
   Uploads,
   User,
   ShortURL as IShortURL,
   Settings as ISettings,
} from 'types/Dashboard';
import Settings from 'components/Dashboard/Settings';
import capitalizeFirstLetter from 'api/utils/capitalizeFirstLetter';
import { useCookies } from 'react-cookie';

interface SiteProps {
   uploads: Uploads[];
   shortedURLs: IShortURL[];
   initalusers: User[];
   initalsettings: ISettings[];
   notifications: Notification[];
}

const Dashboard: NextPage<SiteProps> = ({
   uploads,
   shortedURLs,
   initalusers,
   notifications,
   initalsettings,
}) => {
   const [uploadFiles, setUploadFiles] = useState<typeof uploads>(uploads);
   const [shortedURL, setShortedURL] =
      useState<typeof shortedURLs>(shortedURLs);
   const [users, setUsers] = useState<typeof initalusers>(initalusers);
   const [settings, setSettings] =
      useState<typeof initalsettings>(initalsettings);
   const currentDashboardPage = useCurrentDashboardPage();
   const updateDashboardPage = useCurrentDashboardPageUpdate();
   const [search, setSearch] = useState('');
   const [cookies, setCookies, removeCookies] = useCookies();

   useEffect(() => {
      setUploadFiles(uploads);
      setShortedURL(shortedURLs);
      setUsers(initalusers);
      setSettings(initalsettings);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);
      const site = Router.query.site as string | undefined;

      if (site === 'files')
         updateDashboardPage?.setCurrentDashboardPage('files');
      else if (site === 'links')
         updateDashboardPage?.setCurrentDashboardPage('links');
      else if (site === 'users')
         updateDashboardPage?.setCurrentDashboardPage('users');

      Router.replace('/dashboard', undefined, { shallow: true });

      if (
         settings.find((setting) => setting.name === 'notifications')?.value ===
         'true'
      ) {
         notifications.forEach((notification: Notification) => {
            if (cookies['notification_' + notification.name] === undefined) {
               if (notification.show) {
                  setTimeout(() => {
                     const confirm = window.confirm(notification.message);
                     if (confirm) {
                        setCookies(
                           'notification_' + notification.name,
                           'true',
                           {
                              path: '/dashboard',
                           },
                        );
                     }
                  }, 100);
               }
            }
         });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [shortedURLs, uploads]);

   function searchChange(searchID: string) {
      if (searchID) {
         setUploadFiles(
            uploads.filter(
               (upload) =>
                  upload.name.toLowerCase().startsWith(searchID) ||
                  upload.name.toLowerCase().includes(searchID) ||
                  upload.originalfilename.toLowerCase().startsWith(searchID) ||
                  upload.originalfilename.toLowerCase().includes(searchID),
            ),
         );
         setShortedURL(
            shortedURLs.filter(
               (link) =>
                  link.name.toLowerCase().startsWith(searchID) ||
                  link.name.toLowerCase().includes(searchID) ||
                  link.url.toLowerCase().startsWith(searchID) ||
                  link.url.toLowerCase().includes(searchID),
            ),
         );
         setUsers(
            initalusers.filter(
               (user) =>
                  user.username.toLowerCase().startsWith(searchID) ||
                  user.username.toLowerCase().includes(searchID),
            ),
         );
         setSettings(
            initalsettings.filter(
               (setting) =>
                  setting.name.toLowerCase().startsWith(searchID) ||
                  setting.name.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setUploadFiles(uploads);
         setShortedURL(shortedURLs);
         setUsers(initalusers);
         setSettings(initalsettings);
      }
      setSearch(searchID);
   }

   return (
      <Layout
         dashboard={true}
         meta={{
            title: 'Upload • Dashboard',
         }}
      >
         <DashboardTitle>
            Dashboard - {capitalizeFirstLetter(currentDashboardPage)}
         </DashboardTitle>
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
            {currentDashboardPage === 'files' ? (
               <FileUpload
                  setUploadFiles={setUploadFiles}
                  uploadFiles={uploadFiles}
               />
            ) : currentDashboardPage === 'links' ? (
               <ShortURL
                  setShortedURL={setShortedURL}
                  shortedURL={shortedURL}
               />
            ) : currentDashboardPage === 'users' ? (
               <Users setUsers={setUsers} users={users} />
            ) : currentDashboardPage === 'settings' ? (
               <Settings settings={settings} setSettings={setSettings} />
            ) : (
               <h4>Not found</h4>
            )}
         </DashboardWrapper>
      </Layout>
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

const DashboardTitle = styled.p`
   font-size: 48px;
   font-weight: 500;

   @media (max-width: 768px) {
      font-size: 32px;
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

   const settings = await axiosClient
      .get(server + '/api/dashboard/settings', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch();

   const settingsData = settings.data;

   const notifications = await axiosClient
      .get('api/dashboard/notifications', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch();
   const notificationsData: Notification[] = notifications.data.notifications;
   const notificationsFinal: Notification[] = notificationsData.filter(
      (notification) => notification.show,
   );

   return {
      props: {
         uploads: uploadData,
         shortedURLs: shortedURLsData,
         initalusers: usersData,
         initalsettings: settingsData,
         notifications: notificationsFinal,
      },
   };
};

export default Dashboard;
