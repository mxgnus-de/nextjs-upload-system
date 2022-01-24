import Container from 'components/Container/Container';
import HasteContainer from 'components/Haste/Container/Container';
import CustomContainer from 'components/Haste/CustomContainer/CustomContainer';
import HasteLineNumbers from 'components/Haste/LineNumbers/LineNumbers';
import HasteTextArea from 'components/Haste/TextArea/TextArea';
import Widgit from 'components/Haste/Widgit/Widgit';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';

const Haste: NextPage = () => {
   const [haste, setHaste] = useState('');
   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Haste',
            }}
         />

         <Widgit hasteValue={haste} setHasteValue={setHaste} canSave={true} />

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

export default Haste;
