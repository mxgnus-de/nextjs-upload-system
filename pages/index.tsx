import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Meta from 'components/Meta/Meta';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import Container from 'components/Container/Container';
import Navbar from 'components/Navbar/Navbar';
import Wrapper from 'components/Wrapper/Wrapper';
import Hyphen from 'components/Hyphen/Hyphen';
import Input from 'components/Input/Input';
import SubmitButton from 'components/SubmitButton/SubmitButton';
import Form from 'components/Form/Form';
import axiosClient from 'api/axiosClient';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import LinearProgress from '@mui/material/LinearProgress';

type Files = FileList | null;

const Home: NextPage = () => {
   const [uploading, setUploading] = useState(false);
   const [currentFiles, setCurrentFiles] = useState<Files>();
   const [uploadProgress, setUploadProgress] = useState<number | null>(null);
   const fileuploadRef = useRef<HTMLInputElement>(null);
   const router = useRouter();
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();

   useEffect(() => {
      setCurrentFiles(null);
   }, []);

   async function uploadFile() {
      const file = currentFiles?.item(0);
      if (!file) {
         fileuploadRef.current?.click();
         fileuploadRef.current?.focus();
         return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const config: AxiosRequestConfig<FormData> = {
         headers: { 'content-type': 'multipart/form-data' },
         onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
         },
      };

      await axiosClient
         .post('/api/upload', formData, config)
         .then(async (res: AxiosResponse) => {
            setUploading(false);
            const clipboard = navigator?.clipboard;
            if (clipboard) {
               await clipboard.writeText(res.data).catch((err) => {});
            }
            updateSuccessWidget?.showSuccessWidget(
               'File uploaded!' + (clipboard ? ' Copied to clipboard' : ''),
            );
            router.push(res.data);
         })
         .catch((err: AxiosError) => {
            setUploading(false);
            updateErrorWidget?.showErrorWidget(
               'Upload failed.\n' +
                  (err.response?.data?.message || err.response?.statusText),
            );
         })
         .finally(() => {
            setUploading(false);
            setUploadProgress(null);
         });
   }

   return (
      <>
         {uploadProgress && (
            <LinearProgress value={uploadProgress} variant='determinate' />
         )}
         <Meta
            meta={{
               title: 'Upload • Home',
            }}
         />
         <Navbar />
         <Container>
            <Wrapper>
               <h1>{uploading ? <UploadAnimation /> : 'Upload'}</h1>
               <Hyphen className='text-muted' />
               <Form>
                  <label htmlFor='inputfile'>File</label>
                  <Input
                     type='file'
                     ref={fileuploadRef}
                     onChange={(e) => setCurrentFiles(e.target.files)}
                     name='inputfile'
                  />
                  <SubmitButton
                     type='submit'
                     className='button button-green'
                     onClick={() => {
                        uploadFile();
                     }}
                  >
                     Upload
                  </SubmitButton>
               </Form>
            </Wrapper>
         </Container>
      </>
   );
};

function UploadAnimation() {
   const [animation, setAnimation] = useState('...');

   useEffect(() => {
      const interval = setInterval(() => {
         if (animation.includes('...')) {
            setAnimation('.');
         } else {
            setAnimation((prev) => {
               return prev + '.';
            });
         }
      }, 500);

      return () => {
         clearInterval(interval);
      };
   });
   return <span>Uploading{animation}</span>;
}

export default Home;
