import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import ShortURL from 'components/Dashboard/ShortedURL';
import Layout from 'components/Layout/Layout';
import DashboardSearch from 'components/Dashboard/DashboardSearch';
import DashboardTitle from 'components/Dashboard/DashboardTitle';
import { Shorter } from '@prisma/client';
import { ShorterOwner } from 'types/Dashboard';

interface SiteProps {
   shortedURLs: ShorterOwner[];
}

const Dashboard: NextPage<SiteProps> = ({ shortedURLs }) => {
   const [shortedURL, setShortedURL] =
      useState<typeof shortedURLs>(shortedURLs);
   const [search, setSearch] = useState('');

   useEffect(() => {
      setShortedURL(shortedURLs);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);
      Router.replace('/dashboard/links', undefined, { shallow: true });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function searchChange(searchID: string) {
      if (searchID) {
         setShortedURL(
            shortedURLs.filter(
               (link) =>
                  link.name.toLowerCase().startsWith(searchID) ||
                  link.name.toLowerCase().includes(searchID) ||
                  link.url.toLowerCase().startsWith(searchID) ||
                  link.url.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setShortedURL(shortedURLs);
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
         <DashboardTitle>Dashboard - Links</DashboardTitle>
         <Hyphen className='text-muted' />
         <DashboardSearch searchValue={search} searchChange={searchChange} />
         <DashboardWrapper>
            <ShortURL setShortedURL={setShortedURL} shortedURL={shortedURL} />
         </DashboardWrapper>
      </Layout>
   );
};

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const shortedURLs = await axiosClient
      .get(process.env.NEXT_PUBLIC_URL + '/api/dashboard/shorts', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch(() => {});
   const shortedURLsData = shortedURLs?.data;

   return {
      props: {
         shortedURLs: shortedURLsData,
      },
   };
};

export default Dashboard;
