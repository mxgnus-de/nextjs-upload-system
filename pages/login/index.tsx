import axiosClient from 'api/axiosClient';
import { validateUploadKey } from 'api/uploadKey';
import { AxiosError, AxiosResponse } from 'axios';
import Container from 'components/Container/Container';
import ErrorText from 'components/Error/ErrorText/ErrorText';
import Form from 'components/Form/Form';
import Hyphen from 'components/Hyphen/Hyphen';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import SubmitButton from 'components/SubmitButton/SubmitButton';
import Wrapper from 'components/Wrapper/Wrapper';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

const Login: NextPage = () => {
   const [key, setKey] = useState('');
   const keyInputRef = useRef<HTMLInputElement>(null);
   const [error, setError] = useState({ state: false, text: '' });
   const [uploadKeyCookie, setUploadKeyCookie, removeUploadKeyCookie] =
      useCookies(['upload_key']);
   const router = useRouter();

   async function login() {
      setError({ state: false, text: '' });
      const data = {
         uploadKey: key,
      };
      const config = {
         headers: { 'content-type': 'application/json' },
      };
      axiosClient
         .post('/api/auth/login', data, config)
         .then(async (res: AxiosResponse) => {
            if (
               res.status === 200 &&
               res.data.success === true &&
               res.data.uploadKey
            ) {
               const expiresIn = new Date();
               expiresIn.setDate(new Date().getDate() + 5);
               setUploadKeyCookie('upload_key', res.data.uploadKey, {
                  path: '/',
                  expires: expiresIn,
               });
            }
            if (res.data.updated) {
               alert(
                  'Your upload key has been updated.\nNew key: ' +
                     res.data.uploadKey,
               );
            }
            const redirectTo = router.query['redirect'] || '/';
            router.push(redirectTo as string);
         })
         .catch((err: AxiosError) => {
            setError({
               state: true,
               text: err.response?.statusText || 'Error',
            });
         });
   }

   return (
      <>
         <Meta
            meta={{
               title: 'Upload • Login',
            }}
         />
         <Navbar />
         <Container>
            <Wrapper>
               <h1>Login</h1>
               <Hyphen className='text-muted' />
               <Form>
                  <label htmlFor='key'>Upload Key</label>
                  <input
                     ref={keyInputRef}
                     name='key'
                     type='password'
                     placeholder='Your upload key'
                     value={key}
                     onChange={(e) => setKey(e.target.value)}
                  />
                  {error.state && <ErrorText>{error.text}</ErrorText>}
                  <SubmitButton
                     type='submit'
                     className='button button-green'
                     onClick={() => {
                        login();
                     }}
                  >
                     Login
                  </SubmitButton>
               </Form>
            </Wrapper>
         </Container>
      </>
   );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
   const redirectTo = context.query['redirect'] || '/';

   if (await validateUploadKey(context.req.cookies['upload_key'])) {
      return {
         redirect: {
            destination: redirectTo,
         },
         props: {},
      };
   } else {
      return {
         props: {},
      };
   }
};

export default Login;
