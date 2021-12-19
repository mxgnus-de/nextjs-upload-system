import UseContext from 'components/Context/UseContext';
import type { AppProps } from 'next/app';
import 'styles/globals.sass';

function UploadSystem({ Component, pageProps }: AppProps) {
   return (
      <UseContext>
         <Component {...pageProps} />
      </UseContext>
   );
}

export default UploadSystem;
