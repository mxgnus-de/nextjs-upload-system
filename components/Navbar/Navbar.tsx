import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

function Navbar() {
   return (
      <NavbarWrapper>
         <Menu>
            <li>
               <Link href='/'>Upload</Link>
            </li>
            <li>
               <Link href='/dashboard'>Dashboard</Link>
            </li>
            <li>
               <Link href='/shorter'>URL Shorter</Link>
            </li>
         </Menu>
      </NavbarWrapper>
   );
}

const NavbarWrapper = styled.div`
   background-color: #161616;
   width: 100%;
   height: 50px;
   display: flex;
   justify-content: center;
   align-items: center;
`;

const Menu = styled.div`
   width: 80%;
   display: flex;
   justify-content: space-evenly;
   align-items: center;
`;

export default Navbar;
