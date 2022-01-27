import axiosClient from 'api/axiosClient';
import Hyphen from 'components/Hyphen/Hyphen';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import Layout from 'components/Layout/Layout';
import { Settings as ISettings } from 'types/Dashboard';
import Settings from 'components/Dashboard/Settings';
import DashboardSearch from 'components/Dashboard/DashboardSearch';
import DashboardTitle from 'components/Dashboard/DashboardTitle';

interface SiteProps {
   initalsettings: ISettings[];
}

const Dashboard: NextPage<SiteProps> = ({ initalsettings }) => {
   const [settings, setSettings] =
      useState<typeof initalsettings>(initalsettings);
   const [search, setSearch] = useState('');
   const [initsettings, setInitsettings] = useState(initalsettings);

   useEffect(() => {
      setSettings(initalsettings);

      const id = Router.query.id as string | undefined;
      if (id) searchChange(id);

      Router.replace('/dashboard/settings', undefined, { shallow: true });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function searchChange(searchID: string) {
      if (searchID) {
         setSettings(
            initsettings.filter(
               (setting) =>
                  setting.name.toLowerCase().startsWith(searchID) ||
                  setting.name.toLowerCase().includes(searchID),
            ),
         );
      }
      if (searchID === '') {
         setSettings(initsettings);
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
         <DashboardTitle>Dashboard - Settings</DashboardTitle>
         <Hyphen className='text-muted' />
         <DashboardSearch searchValue={search} searchChange={searchChange} />
         <DashboardWrapper>
            <Settings settings={settings} setSettings={setInitsettings} />
         </DashboardWrapper>
      </Layout>
   );
};

export const getServerSideProps: GetServerSideProps<SiteProps> = async (
   context,
) => {
   const settings = await axiosClient
      .get(server + '/api/dashboard/settings', {
         headers: {
            authorization: context.req.cookies['upload_key'] || '',
         },
      })
      .catch(() => {});

   const settingsData = settings?.data;

   return {
      props: {
         initalsettings: settingsData,
      },
   };
};

export default Dashboard;
