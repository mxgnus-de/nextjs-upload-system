import styled from 'styled-components';

const DashboardWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   text-align: center;
   min-width: 70%;

   @media (max-width: 768px) {
      min-width: 50%;
   }
`;

export default DashboardWrapper;
