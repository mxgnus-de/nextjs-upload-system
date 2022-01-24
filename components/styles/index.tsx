import * as styled from 'styled-components';

const GlobalStyles = styled.createGlobalStyle`
   * {
      box-sizing: border-box;
      font-family: 'Open Sans', sans-serif;
      font-weight: 400;
      margin: 0;
      padding: 0;
      color: #fff;
   }
   *::before {
      border: border-box;
   }
   *::after {
      border: border-box;
   }

   body,
   html {
      overflow-x: hidden !important;
      height: 100vh;
   }

   body {
      background-color: #131313;
   }

   #__next {
      display: flex;
      flex-direction: column;
      min-height: 100%;
   }

   /** REMOVE DEFAULT STYLING **/

   textarea {
      background-color: transparent;
      resize: none;

      padding: 0;
      border: none;
      outline: none;
   }

   li {
      list-style: none;
   }

   a {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      font-size: 1rem;
   }

   button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: 1rem;
   }

   input {
      border: none;
      background-color: transparent;
   }
   input:focus {
      outline: none;
   }

   select {
      border: none;
      background-color: transparent;
   }
   select:focus {
      outline: none;
   }

   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      font-weight: 500;
      margin: 0;
      color: #fff;
   }

   h1 {
      font-size: 48px;
   }

   h2 {
      font-size: 36px;
   }

   h3 {
      font-size: 28px;
   }

   h4 {
      font-size: 18px;
   }

   h5 {
      font-size: 16px;
   }

   h6 {
      font-size: 14px;
   }

   p {
      margin-bottom: 1px;
      font-size: 14px;
   }

   label {
      margin: 5px;
      font-size: 1.3rem;
   }

   select {
      color: #000000;
      text-align: center;
      height: 30px;
      width: 200px;
      border-radius: 10px;
      background-color: #ffffff !important;
   }

   input[type='text'],
   input[type='password'] {
      color: #000000;
      text-align: center;
      height: 30px;
      width: 100%;
      border-radius: 10px;
      background-color: #ffffff !important;
   }
   input[type='text'] ::placeholder,
   input[type='password'] ::placeholder {
      color: #fff;
      font-size: 1.5em;
   }

   /** UTILS **/
   .text-muted {
      color: #6c757d !important;
   }

   .title {
      padding-bottom: 20px;
   }

   .pointer {
      cursor: pointer;
   }

   .ml-10 {
      margin-left: 10px;
   }

   /** BUTTONS **/
   .button {
      height: auto;
      width: auto;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      min-width: 3rem;
   }
   .button-white {
      background-color: #000;
      color: #fff;
   }
   .button-red {
      background-color: #a01c29;
      color: #e8e6e3;
   }
   .button-green {
      background-color: #1a6d2d;
      color: #e8e6e3;
      border: 1px solid #28a845;
   }
   .button-yellow {
      background-color: #fff000;
      color: #000000;
   }
   .button-grey {
      background-color: #333232;
      color: #fff;
   }
   .button-blue {
      background-color: #0054ae;
      color: #fff;
   }

   /** COLORS **/
   .color-red {
      color: #a01c29;
   }

   .color-green {
      color: #198131;
   }
   .color-green-light {
      color: #00ff3c;
   }

   .color-yellow {
      color: #fff000;
   }

   .color-grey {
      color: #333232;
   }

   .color-blue {
      color: #0054ae;
   }
`;

export default GlobalStyles;
