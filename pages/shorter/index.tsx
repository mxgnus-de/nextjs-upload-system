import axiosClient from 'api/axiosClient';
import { AxiosError, AxiosResponse } from 'axios';
import Container from 'components/Container/Container';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import Form from 'components/Form/Form';
import Hyphen from 'components/Hyphen/Hyphen';
import Input from 'components/Input/Input';
import Meta from 'components/Meta/Meta';
import Navbar from 'components/Navbar/Navbar';
import SubmitButton from 'components/SubmitButton/SubmitButton';
import Wrapper from 'components/Wrapper/Wrapper';
import { NextPage } from 'next';
import { useRef, useState } from 'react';
import { validateURL } from 'utils/validator';

const Shorter: NextPage = () => {
   const [rawURL, setRawURL] = useState('');
   const [shortURL, setShortURL] = useState('');
   const urlInputRef = useRef<HTMLInputElement>(null);
   const shortURLRef = useRef<HTMLInputElement>(null);
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();

   async function shortUrl() {
      if (!rawURL) return urlInputRef.current?.focus();
      let url = rawURL;
      if (!url.startsWith('https')) {
         url = `https://${url}`;
         setRawURL(url);
      }

      if (!validateURL(url))
         return updateErrorWidget?.showErrorWidget('Invalid URL');

      await axiosClient
         .post(
            '/api/shorter',
            {
               url,
            },
            {
               headers: { 'content-type': 'application/json' },
            },
         )
         .then((res: AxiosResponse) => {
            const clipboard = navigator?.clipboard;
            if (clipboard) {
               clipboard.writeText(res.data);
            }
            updateSuccessWidget?.showSuccessWidget(
               'URL shorted!' + (clipboard ? ' Copied to clipboard' : ''),
            );
            setShortURL(res.data);
         })
         .catch((err: AxiosError) => {
            updateErrorWidget?.showErrorWidget(
               'Short failed\n' +
                  (err.response?.data?.message || err.response?.statusText),
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
                     style={{
                        cursor: 'no-drop',
                     }}
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
