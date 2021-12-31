import Container from 'components/Container/Container';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import Sidebar from 'components/Sidebar/Sidebar';
import styled from 'styled-components';
import { Meta as IMeta } from 'types/Meta';

function Layout({
   children,
   dashboard,
   meta,
}: {
   children: React.ReactNode;
   dashboard: boolean;
   meta: IMeta;
}) {
   return (
      <LayoutContainer>
         <Navbar />
         <LayoutWrapper>
            <Meta meta={meta} />
            <Sidebar />
            <div style={{ width: '100%', height: '100%' }}>
               {dashboard ? (
                  <DashboardContainer>{children}</DashboardContainer>
               ) : (
                  <Container>{children}</Container>
               )}
            </div>
         </LayoutWrapper>
      </LayoutContainer>
   );
}

const LayoutWrapper = styled.div`
   display: flex;
   width: 100%;
   min-height: calc(100vh - 50px);
`;

const DashboardContainer = styled(Container)`
   margin: 50px 0;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   flex-grow: 1;
   text-align: center;
`;

const LayoutContainer = styled.div`
   display: flex;
   flex-direction: column;
   flex-grow: 1;
`;

export default Layout;
