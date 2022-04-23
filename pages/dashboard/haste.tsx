import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import Hastes from 'components/Dashboard/Hastes';
import Layout from 'components/Layout/Layout';
import DashboardSearch from 'components/Dashboard/DashboardSearch';
import DashboardTitle from 'components/Dashboard/DashboardTitle';
import { Haste } from '@prisma/client';
import { HasteOwner } from 'types/Dashboard';

interface SiteProps {
   initalhastes: HasteOwner[];
}

const Dashboard: NextPage<SiteProps> = ({ initalhastes }) => {
   const [hastes, setHastes] = useState<typeof initalhastes>(initalhastes);
   const [search, setSearch] = useState('');

   useEffect(() => {
      setHastes(initalhastes);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);
      Router.replace('/dashboard/haste', undefined, { shallow: true });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function searchChange(searchID: string) {
      if (searchID) {
         setHastes(
            initalhastes.filter(
               (haste) =>
                  haste.id.toLowerCase().startsWith(searchID) ||
                  haste.id.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setHastes(initalhastes);
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
         <DashboardTitle>Dashboard - hastes</DashboardTitle>
         <Hyphen className='text-muted' />
         <DashboardSearch searchValue={search} searchChange={searchChange} />
         <DashboardWrapper>
            <Hastes setHastes={setHastes} hastes={hastes} />
         </DashboardWrapper>
      </Layout>
   );
};

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const hastes = await axiosClient
      .get(process.env.NEXT_PUBLIC_URL + '/api/dashboard/haste', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch(() => {});
   const hastesData = hastes?.data;

   return {
      props: {
         initalhastes: hastesData,
      },
   };
};

export default Dashboard;
