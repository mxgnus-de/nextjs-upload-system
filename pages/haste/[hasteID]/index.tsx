import axiosClient from 'api/axiosClient';
import HasteContainer from 'components/Haste/Container/Container';
import CustomContainer from 'components/Haste/CustomContainer/CustomContainer';
import Widget from 'components/Haste/Widget/Widget';
import Meta from 'components/Meta/Meta';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { HasteViewProps } from 'types/Haste';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styled from 'styled-components';
import path from 'path';
import getLanguageFromExtension from 'utils/haste/getLanguageFromExtension';
import getExtensionFromLanguageName from 'utils/haste/getExtensionFromLanguageName';
import Router from 'next/router';
import { useHasteUpdate } from 'components/Context/HasteContext';
import HasteLineNumbers from 'components/Haste/LineNumbers/LineNumbers';
import HasteTextArea from 'components/Haste/TextArea/TextArea';

const HasteView: NextPage<HasteViewProps> = ({
   hasteID,
   hasteText,
   language: hasteLanguage,
   maxHighlightLength,
}) => {
   const [haste, setHaste] = useState('');
   const [language, setLanguage] = useState<string | undefined>(undefined);
   const updateHaste = useHasteUpdate();

   useEffect(() => {
      setHaste(hasteText);
      if (hasteLanguage) {
         setLanguage(hasteLanguage.name);
         if (!Router.query.hasteID?.includes('.')) {
            const newExtension = hasteLanguage.extension.replaceAll('.', '');
            Router.replace(
               `/haste/${hasteID}.${newExtension}`,
               `/haste/${hasteID}.${newExtension}`,
               { shallow: true },
            );
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const highlighter = haste.length < maxHighlightLength;

   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Haste • ' + hasteID,
               description: hasteText,
            }}
         />

         <Widget canSave={false} hasteID={hasteID} canCopy={true} />

         <CustomContainer
            tabIndex={0}
            onKeyDown={(e) => updateHaste?.handleKeyDownEvent(e)}
         >
            <CustomHasteContainer>
               {highlighter ? (
                  <SyntaxHighlighter
                     language={language}
                     style={vs2015}
                     showLineNumbers
                     customStyle={{
                        width: '100%',
                        height: '100%',
                        fontSize: '14px',
                     }}
                     wrapLines={true}
                     lineNumberStyle={{
                        color: '#7d7d7d',
                     }}
                  >
                     {haste}
                  </SyntaxHighlighter>
               ) : (
                  <CustomContainer>
                     <HasteContainer>
                        <HasteLineNumbers>
                           {haste.split('\n').map((line, index) => (
                              <p key={index}>{index + 1}</p>
                           ))}
                        </HasteLineNumbers>
                        <HasteTextArea
                           autoFocus={true}
                           value={haste}
                           disabled
                        />
                     </HasteContainer>
                  </CustomContainer>
               )}
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
   const hasteID = query.hasteID as string;
   let error = false;
   const response = await axiosClient
      .get('/api/haste/' + hasteID.split('.')[0])
      .catch(() => {
         error = true;
      });
   if (error || !response || !response?.data?.haste) {
      return {
         notFound: true,
      };
   }
   const haste = response.data.haste;
   const settings = await axiosClient.get('/api/settings').catch(() => {});
   const maxHighlightLength =
      settings?.data?.find((s: any) => s.name === 'maxHighlightLength')
         ?.value || 12500;
   let language = null;

   if (haste.language) {
      const extension = getExtensionFromLanguageName(haste.language);
      if (extension)
         language = {
            name: haste.language,
            extension,
         };
   }
   let languageExtension = path.extname(hasteID).replace('.', '') || undefined;
   let languageName = undefined;
   if (languageExtension) {
      languageName = getLanguageFromExtension(languageExtension)?.toLowerCase();
   }

   if (languageExtension && languageName)
      language = {
         name: languageName,
         extension: languageExtension,
      };

   return {
      props: {
         hasteID: haste.id,
         hasteText: haste.haste,
         language,
         maxHighlightLength,
      },
   };
};

export default HasteView;
