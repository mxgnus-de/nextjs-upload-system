import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import Users from 'components/Dashboard/Users';
import Layout from 'components/Layout/Layout';
import DashboardSearch from 'components/Dashboard/DashboardSearch';
import DashboardTitle from 'components/Dashboard/DashboardTitle';
import { User } from '@prisma/client';

interface SiteProps {
   initalusers: User[];
}

const Dashboard: NextPage<SiteProps> = ({ initalusers }) => {
   const [users, setUsers] = useState<typeof initalusers>(initalusers);
   const [search, setSearch] = useState('');

   useEffect(() => {
      setUsers(initalusers);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);
      Router.replace('/dashboard/users', undefined, { shallow: true });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function searchChange(searchID: string) {
      if (searchID) {
         setUsers(
            initalusers.filter(
               (user) =>
                  user.username.toLowerCase().startsWith(searchID) ||
                  user.username.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setUsers(initalusers);
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
         <DashboardTitle>Dashboard - Users</DashboardTitle>
         <Hyphen className='text-muted' />
         <DashboardSearch searchValue={search} searchChange={searchChange} />
         <DashboardWrapper>
            <Users setUsers={setUsers} users={users} />
         </DashboardWrapper>
      </Layout>
   );
};

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   let err = false;
   const users = await axiosClient
      .get(server + '/api/dashboard/users', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch(() => {
         err = true;
      });
   if (err)
      return {
         redirect: {
            destination: '/dashboard',
            permanent: false,
         },
      };
   const usersData = users?.data;

   return {
      props: {
         initalusers: usersData,
      },
   };
};

export default Dashboard;
