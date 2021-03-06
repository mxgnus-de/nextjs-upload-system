import styled from 'styled-components';

const DashboardButtons = styled.div`
   display: flex;

   * {
      margin: 0 0.2rem;
      font-size: 15px;
   }

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
   }
`;

export default DashboardButtons;
