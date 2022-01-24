import styled from 'styled-components';

const HasteLineNumbers = styled.div`
   p {
      color: ${({ color }: { color?: string }) => color || '#7d7d7d'};
   }
`;

export default HasteLineNumbers;
