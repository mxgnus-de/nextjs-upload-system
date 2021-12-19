import React from 'react';
import styled from 'styled-components';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
interface ErrorWidgitProps {
   text: string;
}

function ErrorWidgit(props: ErrorWidgitProps) {
   return (
      <Wrapper>
         <CustomErrorIcon />
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
   background-color: #dd2929;
   border-radius: 5px;

   @media (max-width: 512px) {
      right: 10px;
   }
`;

const CustomErrorIcon = styled(ErrorOutlineIcon)`
   margin-right: 4px;
`;
export default ErrorWidgit;
