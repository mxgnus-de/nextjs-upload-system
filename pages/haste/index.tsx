import axiosClient from 'api/axiosClient';
import HasteContainer from 'components/Haste/Container/Container';
import CustomContainer from 'components/Haste/CustomContainer/CustomContainer';
import HasteLineNumbers from 'components/Haste/LineNumbers/LineNumbers';
import HasteTextArea from 'components/Haste/TextArea/TextArea';
import Widgit from 'components/Haste/Widgit/Widgit';
import Meta from 'components/Meta/Meta';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { HasteCreateProps } from 'types/Haste';

const Haste: NextPage<HasteCreateProps> = ({ haste: hasteInit }) => {
   const [haste, setHaste] = useState(hasteInit || '');
   useEffect(() => {
      Router.replace('/haste', '/haste', { shallow: true });
   }, []);
   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Haste',
            }}
         />

         <Widgit
            hasteValue={haste}
            setHasteValue={setHaste}
            canSave={true}
            canCopy={false}
         />

         <CustomContainer>
            <HasteContainer>
               <HasteLineNumbers>
                  <p>&gt;</p>
               </HasteLineNumbers>
               <HasteTextArea
                  autoFocus={true}
                  value={haste}
                  onChange={(e) => setHaste(e.target.value)}
               />
            </HasteContainer>
         </CustomContainer>
      </>
   );
};

export const getServerSideProps: GetServerSideProps<HasteCreateProps> = async ({
   query,
}) => {
   let haste = '';
   const { copy }: { copy?: string } = query;
   if (copy) {
      await axiosClient
         .get('/api/haste/' + copy)
         .catch((err) => {
            haste = '';
         })
         .then((res) => {
            haste = res?.data?.haste?.haste || '';
         });
   }
   return {
      props: {
         haste,
      },
   };
};

export default Haste;
