import axiosClient from 'api/axiosClient';
import { useHaste, useHasteUpdate } from 'components/Context/HasteContext';
import HasteContainer from 'components/Haste/Container/Container';
import CustomContainer from 'components/Haste/CustomContainer/CustomContainer';
import HasteLineNumbers from 'components/Haste/LineNumbers/LineNumbers';
import HasteTextArea from 'components/Haste/TextArea/TextArea';
import Widget from 'components/Haste/Widget/Widget';
import Meta from 'components/Meta/Meta';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { HasteCreateProps } from 'types/Haste';

const Haste: NextPage<HasteCreateProps> = ({ haste: hasteInit }) => {
   const updateHaste = useHasteUpdate();
   const haste = useHaste();
   const textAreaRef = useRef<HTMLTextAreaElement>(null);

   useEffect(() => {
      if (hasteInit) updateHaste?.setHaste(hasteInit);
      Router.replace('/haste', '/haste', { shallow: true });
      textAreaRef.current?.focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      updateHaste?.setTextAreaRef(textAreaRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [textAreaRef]);

   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Haste',
            }}
         />

         <Widget canSave={true} canCopy={false} />

         <CustomContainer
            onKeyDown={(e) => {
               updateHaste?.handleKeyDownEvent(e);
            }}
         >
            <HasteContainer>
               <HasteLineNumbers>
                  <p>&gt;</p>
               </HasteLineNumbers>
               <HasteTextArea
                  onKeyDown={(e) => updateHaste?.handleTextAreaKeyDownEvent(e)}
                  autoFocus={true}
                  value={haste}
                  onChange={(e) => updateHaste?.setHaste(e.target.value)}
                  ref={textAreaRef}
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
         .catch((err) => {})
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
