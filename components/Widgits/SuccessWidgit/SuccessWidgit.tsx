import React from 'react';
import styled from 'styled-components';
import CheckIcon from '@mui/icons-material/Check';

interface SuccessWidgitProps {
   text: string;
}

function SuccessWidgit(props: SuccessWidgitProps) {
   return (
      <Wrapper>
         <CustomCheckIcon />
         <span>{props.text}</span>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   position: fixed;
   display: flex;
   align-items: center;
   right: 30px;
   bottom: 30px;
   padding: 5px 10px;
   background-color: #1b970b;
   border-radius: 5px;

   @media (max-width: 512px) {
      right: 10px;
   }
`;

const CustomCheckIcon = styled(CheckIcon)`
   margin-right: 4px;
`;
export default SuccessWidgit;
