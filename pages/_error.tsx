import styled from 'styled-components';
import Container from 'components/Container/Container';
import { NextPage } from 'next';

interface SiteProps {
   statusCode: number;
   statusMessage: string;
}

const PageError: NextPage<SiteProps> = ({ statusCode, statusMessage }) => {
   return (
      <>
         <Container>
            <div>
               <ErrorCode>{statusCode}</ErrorCode>
               <ErrorMessageWrapper>
                  <ErrorMessage>{statusMessage}</ErrorMessage>
               </ErrorMessageWrapper>
            </div>
         </Container>
      </>
   );
};

PageError.getInitialProps = async ({ res, err }) => {
   const statusCode = err?.statusCode ? err.statusCode : 404;
   const statusMessage = res
      ? res.statusMessage
      : err
      ? err.message
      : 'Uknown error';
   return { statusCode, statusMessage };
};

const ErrorCode = styled.h1`
   display: inline-block;
   border-right: 1px solid rgba(255, 255, 255, 0.74);
   margin: 0;
   margin-right: 20px;
   padding: 10px 23px 10px 0;
   font-size: 24px;
   font-weight: 500;
   vertical-align: top;
`;

const ErrorMessageWrapper = styled.div`
   display: inline-block;
   text-align: left;
   line-height: 49px;
   height: 49px;
   vertical-align: middle;
`;

const ErrorMessage = styled.h2`
   font-size: 14px;
   font-weight: normal;
   line-height: inherit;
   margin: 0;
   padding: 0;
`;

export default PageError;
