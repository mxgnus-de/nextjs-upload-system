import UseContext from 'components/Context/UseContext';
import GlobalStyles from 'components/styles';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';

function UploadSystem({ Component, pageProps }: AppProps) {
   return (
      <>
         <GlobalStyles />
         <NextNprogress
            options={{
               showSpinner: false,
            }}
         />
         <UseContext>
            <Component {...pageProps} />
         </UseContext>
      </>
   );
}

export default UploadSystem;
