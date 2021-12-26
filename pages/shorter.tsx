import axiosClient from 'api/axiosClient';
import { AxiosError, AxiosResponse } from 'axios';
import Container from 'components/Container/Container';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import Form from 'components/Form/Form';
import Hyphen from 'components/Hyphen/Hyphen';
import Input from 'components/Input/Input';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import SubmitButton from 'components/SubmitButton/SubmitButton';
import Wrapper from 'components/Wrapper/Wrapper';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

const Shorter: NextPage = () => {
   const [rawURL, setRawURL] = useState('');
   const [shortURL, setShortURL] = useState('');
   const urlInputRef = useRef<HTMLInputElement>(null);
   const shortURLRef = useRef<HTMLInputElement>(null);
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();

   async function shortUrl() {
      if (!rawURL) return urlInputRef.current?.focus();

      const config = {
         headers: { 'content-type': 'application/json' },
      };
      const data = {
         url: rawURL,
      };

      await axiosClient
         .post('/api/shorter', data, config)
         .then((res: AxiosResponse) => {
            const clipboard = navigator?.clipboard;
            if (clipboard) {
               clipboard.writeText(res.data);
            }
            updateSuccessWidgit?.showSuccessWidgit(
               'URL shorted!' + (clipboard ? ' Copied to clipboard' : ''),
            );
            setShortURL(res.data);
         })
         .catch((err: AxiosError) => {
            updateErrorWidgit?.showErrorWidgit(
               'Short failed\n' + err.response?.statusText,
            );
         });
   }

   return (
      <>
         <Meta
            meta={{
               title: 'Upload • URL Shorter',
            }}
         />
         <Navbar />
         <Container>
            <Wrapper>
               <h1>URL Shorter</h1>
               <Hyphen className='text-muted' />
               <Form>
                  <label htmlFor='shorturl'>Shorted URL</label>
                  <Input
                     type='text'
                     ref={shortURLRef}
                     value={shortURL}
                     name='shorturl'
                     placeholder='Shorted URL will be here'
                     readOnly
                  />
                  <label htmlFor='rawurl'>Raw url</label>
                  <input
                     ref={urlInputRef}
                     name='rawurl'
                     type='text'
                     placeholder='URL to short'
                     value={rawURL}
                     onChange={(e) => setRawURL(e.target.value)}
                  />
                  <SubmitButton
                     type='submit'
                     className='button button-green'
                     onClick={() => {
                        shortUrl();
                     }}
                  >
                     Short URL
                  </SubmitButton>
               </Form>
            </Wrapper>
         </Container>
      </>
   );
};

export default Shorter;
