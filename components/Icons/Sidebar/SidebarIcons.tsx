import styled from 'styled-components';

function SidebarIconClose() {
   return (
      <SvgIcon
         width='32'
         height='32'
         viewBox='0 0 32 32'
         fill='none'
         xmlns='http://www.w3.org/2000/svg'
      >
         <path
            d='M12.4697 15.4697C12.1768 15.7626 12.1768 16.2374 12.4697 16.5303L17.2426 21.3033C17.5355 21.5962 18.0104 21.5962 18.3033 21.3033C18.5962 21.0104 18.5962 20.5355 18.3033 20.2426L14.0607 16L18.3033 11.7574C18.5962 11.4645 18.5962 10.9896 18.3033 10.6967C18.0104 10.4038 17.5355 10.4038 17.2426 10.6967L12.4697 15.4697ZM26 15.25L13 15.25V16.75H26V15.25Z'
            fill='#B6B6B6'
         />
         <line
            x1='10.75'
            y1='10'
            x2='10.75'
            y2='22'
            stroke='#B6B6B6'
            strokeWidth='1.5'
         />
      </SvgIcon>
   );
}

function SidebarIconOpen() {
   return (
      <SvgIcon
         width='32'
         height='32'
         viewBox='0 0 32 32'
         fill='none'
         xmlns='http://www.w3.org/2000/svg'
      >
         <path
            d='M19.5303 15.4697C19.8232 15.7626 19.8232 16.2374 19.5303 16.5303L14.7574 21.3033C14.4645 21.5962 13.9896 21.5962 13.6967 21.3033C13.4038 21.0104 13.4038 20.5355 13.6967 20.2426L17.9393 16L13.6967 11.7574C13.4038 11.4645 13.4038 10.9896 13.6967 10.6967C13.9896 10.4038 14.4645 10.4038 14.7574 10.6967L19.5303 15.4697ZM6 15.25L19 15.25V16.75H6V15.25Z'
            fill='#B6B6B6'
         />
         <line
            y1='-0.75'
            x2='12'
            y2='-0.75'
            transform='matrix(0 1 1 0 22 10)'
            stroke='#B6B6B6'
            strokeWidth='1.5'
         />
      </SvgIcon>
   );
}

const SvgIcon = styled.svg`
   cursor: pointer;
`;

export { SidebarIconClose, SidebarIconOpen };
