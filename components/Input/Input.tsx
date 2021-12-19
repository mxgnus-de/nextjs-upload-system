import styled from 'styled-components';

const Input = styled.input`
   display: block;
   width: 100%;
   padding: 0.375rem 0.75rem;
   font-size: 1rem;
   font-weight: 400;
   line-height: 1.5;
   color: #212529;
   background-color: #fff;
   background-clip: padding-box;
   border: 1px solid #ced4da;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   border-radius: 0.25rem;
   transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
   ::file-selector-button {
      padding: 0.375rem 0.75rem;
      margin: -0.375rem -0.75rem;
      -webkit-margin-end: 0.75rem;
      margin-inline-end: 0.75rem;
      color: #212529;
      background-color: #e9ecef;
      pointer-events: none;
      border-color: inherit;
      border-style: solid;
      border-width: 0;
      border-inline-end-width: 1px;
      border-radius: 0;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
         border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
   }
`;

export default Input;
