import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import FileUpload from 'components/Dashboard/FileUpload';
import Layout from 'components/Layout/Layout';
import DashboardTitle from 'components/Dashboard/DashboardTitle';
import { File } from '@prisma/client';
import { FileOwner } from 'types/Dashboard';
import DashboardSearch from 'components/Dashboard/DashboardSearch';

interface SiteProps {
   uploads: FileOwner[];
}

const Dashboard: NextPage<SiteProps> = ({ uploads }) => {
   const [uploadFiles, setUploadFiles] = useState<FileOwner[]>(uploads);
   const [search, setSearch] = useState<string>('');

   useEffect(() => {
      setUploadFiles(uploads);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);

      Router.replace('/dashboard', undefined, { shallow: true });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function searchChange(searchID: string) {
      if (searchID) {
         setUploadFiles(
            uploads.filter(
               (upload) =>
                  upload.name.toLowerCase().startsWith(searchID) ||
                  upload.name.toLowerCase().includes(searchID) ||
                  upload.originalfilename.toLowerCase().startsWith(searchID) ||
                  upload.originalfilename.toLowerCase().includes(searchID) ||
                  upload.alias?.toLowerCase().startsWith(searchID) ||
                  upload.alias?.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setUploadFiles(uploads);
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
         <DashboardTitle>Dashboard - Files</DashboardTitle>
         <Hyphen className='text-muted' />
         <DashboardSearch searchValue={search} searchChange={searchChange} />
         <DashboardWrapper>
            <FileUpload
               setUploadFiles={setUploadFiles}
               uploadFiles={uploadFiles}
            />
         </DashboardWrapper>
      </Layout>
   );
};

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const uploads = await axiosClient
      .get(server + '/api/dashboard/uploads', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch(() => {});
   const uploadData = uploads?.data;

   return {
      props: {
         uploads: uploadData,
      },
   };
};

export default Dashboard;
