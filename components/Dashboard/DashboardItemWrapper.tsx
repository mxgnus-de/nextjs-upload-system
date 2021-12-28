import styled from 'styled-components';

const DashboardItemWrapper = styled.div`
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   margin: 0.5rem;
   background-color: #26282b;
   border-radius: 0.5rem;
   padding: 1rem;

   div {
      margin: 0.5rem;
   }

   @media (max-width: 1056px) {
      flex-direction: column;
   }
`;

export default DashboardItemWrapper;
