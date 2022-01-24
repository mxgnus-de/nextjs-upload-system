import axiosClient from 'api/axiosClient';
import HasteContainer from 'components/Haste/Container/Container';
import CustomContainer from 'components/Haste/CustomContainer/CustomContainer';
import Widgit from 'components/Haste/Widgit/Widgit';
import Meta from 'components/Meta/Meta';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { HasteViewProps } from 'types/Haste';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styled from 'styled-components';

const HasteView: NextPage<HasteViewProps> = ({ hasteID, hasteText }) => {
   const [haste, setHaste] = useState('');
   useEffect(() => {
      setHaste(hasteText);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Haste',
            }}
         />

         <Widgit hasteValue={haste} setHasteValue={setHaste} canSave={false} />

         <CustomContainer>
            <CustomHasteContainer>
               <SyntaxHighlighter
                  style={vs2015}
                  showLineNumbers
                  customStyle={{
                     width: '100%',
                     height: '100%',
                     fontSize: '14px',
                     wordBreak: 'break-all',
                  }}
                  wrapLines={true}
                  lineNumberStyle={{
                     color: '#7d7d7d',
                  }}
               >
                  {haste}
               </SyntaxHighlighter>
            </CustomHasteContainer>
         </CustomContainer>
      </>
   );
};

const CustomHasteContainer = styled(HasteContainer)`
   align-items: flex-start;
   justify-content: flex-start;
   text-align: start;
   padding: 0;
   background-color: #1e1e1e;
`;

export const getServerSideProps: GetServerSideProps<HasteViewProps> = async ({
   req,
   query,
   res,
}) => {
   const { hasteID } = query;
   let error = false;
   const response = await axiosClient.get('/api/haste/' + hasteID).catch(() => {
      error = true;
   });
   if (error || !response || !response?.data?.haste) {
      return {
         notFound: true,
      };
   }

   const haste = response.data.haste;

   return {
      props: {
         hasteID: haste.id,
         hasteText: haste.haste,
      },
   };
};

export default HasteView;
