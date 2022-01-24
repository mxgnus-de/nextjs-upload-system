import styled from 'styled-components';

const HasteTextArea = styled.textarea`
   min-height: calc(100vh - 2rem);
   margin-left: 1rem;
   color: ${({ color }: { color?: string }) => color || '#7d7d7d'};
   width: 100%;
`;

export default HasteTextArea;
