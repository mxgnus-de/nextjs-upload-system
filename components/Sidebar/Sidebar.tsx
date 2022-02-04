import Hyphen from 'components/Hyphen/Hyphen';
import {
   SidebarIconClose,
   SidebarIconOpen,
} from 'components/Icons/Sidebar/SidebarIcons';
import styled from 'styled-components';
import DashboardPages from 'types/DashboardPages';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import UsersIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import {
   useSidebarStatus,
   useSidebarStatusUpdate,
} from 'components/Context/SidebarStatusContext';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Router from 'next/router';
import { useEffect, useState } from 'react';

interface SiteProps {}

function Sidebar({}: SiteProps) {
   const sidebarStatus = useSidebarStatus();
   const updateSidebarStatus = useSidebarStatusUpdate();
   const [path, setPath] = useState('');

   useEffect(() => {
      setPath(Router.pathname);
   }, []);

   const sidebarItems: {
      id: number;
      name: string;
      icon: JSX.Element;
      site: DashboardPages;
   }[] = [
      {
         id: 0,
         icon: <FileIcon />,
         name: 'Files',
         site: '/dashboard',
      },
      {
         id: 1,
         icon: <LinkIcon />,
         name: 'Links',
         site: '/dashboard/links',
      },
      {
         id: 2,
         icon: <TextSnippetIcon />,
         name: 'Haste',
         site: '/dashboard/haste',
      },
      {
         id: 3,
         icon: <UsersIcon />,
         name: 'Users',
         site: '/dashboard/users',
      },
      {
         id: 4,
         icon: <SettingsIcon />,
         name: 'Settings',
         site: '/dashboard/settings',
      },
   ];

   return (
      <SidebarWrapper sidebarStatus={sidebarStatus}>
         <SidebarIconWrapper>
            <button onClick={() => updateSidebarStatus?.toggleSidebarStatus()}>
               {sidebarStatus ? <SidebarIconClose /> : <SidebarIconOpen />}
            </button>
         </SidebarIconWrapper>
         <Hyphen />
         {sidebarStatus === true ? (
            <SidebarOpenWrapper>
               {sidebarItems
                  .sort((sidebarItemA, sideBarItemB) => {
                     return sidebarItemA.id - sideBarItemB.id;
                  })
                  .map((sidebarItem) => {
                     return (
                        <div
                           key={sidebarItem.id}
                           onClick={() => Router.push(sidebarItem.site)}
                        >
                           <SidebarItem
                              path={sidebarItem.site}
                              currentPage={path}
                           >
                              <SidebarItemWrapper
                                 path={sidebarItem.site}
                                 currentPage={path}
                              >
                                 {sidebarItem.icon}
                                 <SideBarItemLink closed={false}>
                                    {sidebarItem.name}
                                 </SideBarItemLink>
                              </SidebarItemWrapper>
                           </SidebarItem>
                        </div>
                     );
                  })}
            </SidebarOpenWrapper>
         ) : (
            <SidebarCloseWrapper>
               {sidebarItems
                  .sort((sidebarItemA, sideBarItemB) => {
                     return sidebarItemA.id - sideBarItemB.id;
                  })
                  .map((sidebarItem) => {
                     return (
                        <div key={sidebarItem.id}>
                           <SideBarItemLink
                              closed={true}
                              onClick={() => Router.push(sidebarItem.site)}
                           >
                              <SidebarItemClose
                                 path={sidebarItem.site}
                                 currentPage={path}
                              >
                                 {sidebarItem.icon}
                              </SidebarItemClose>
                           </SideBarItemLink>
                        </div>
                     );
                  })}
            </SidebarCloseWrapper>
         )}
      </SidebarWrapper>
   );
}

const SidebarWrapper = styled.div`
   position: relative;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: ${(props: { sidebarStatus: boolean }) =>
      props.sidebarStatus ? '300' : '100'}px;
   padding: 20px 10px;
   z-index: 10;
   bottom: 0;
   top: 0;
   background-color: #191a1b;

   @media (max-width: 896px) {
      width: ${(props: { sidebarStatus: boolean }) =>
         props.sidebarStatus ? '100vw' : '70px'};
   }

   @media (max-width: 600px) {
      ${(props: { sidebarStatus: boolean }) =>
         props.sidebarStatus
            ? 'width: 100vw; position: absolute; top: 0; left: 0; bottom: 0; right: 0;'
            : 'width: 50px'};
   }
`;

const SidebarIconWrapper = styled.div`
   display: flex;
   justify-content: center;
`;

const SidebarOpenWrapper = styled.div`
   width: 100%;
   height: 100%;
`;

const SidebarCloseWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const SidebarItem = styled.div`
   display: flex;
   align-items: center;
   padding: 5px 20px;
   cursor: pointer;

   svg {
      min-width: 24px;
      min-height: 24px;
      path {
         color: ${(props: { path: string; currentPage: string }) =>
            props.path === props.currentPage ? '#fff000' : '#828282'};
      }
   }
`;

const SidebarItemClose = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 5px 0;

   svg path {
      color: ${(props: { path: string; currentPage: string }) =>
         props.path === props.currentPage ? '#fff000' : '#828282'};
   }
`;

const SidebarItemWrapper = styled.div`
   height: 100%;
   width: 100%;
   display: flex;
   align-items: center;
   padding: 8px 15px;
   border-radius: 5px;
   background-color: ${(props: { path: string; currentPage: string }) =>
      props.path === props.currentPage ? '#222227' : 'transparent'};
`;

const SideBarItemLink = styled.div`
   ${(props: { closed: boolean }) => (props.closed ? '' : 'margin-left: 20px;')}
   font-size: 16px;
   cursor: pointer;
`;

export default Sidebar;
