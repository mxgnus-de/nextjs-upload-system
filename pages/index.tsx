import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Meta from 'components/Meta/Meta';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import Container from 'components/Container/Container';
import Navbar from 'components/Navbar/Navbar';
import Wrapper from 'components/Wrapper/Wrapper';
import Hyphen from 'components/Hyphen/Hyphen';
import Input from 'components/Input/Input';
import SubmitButton from 'components/SubmitButton/SubmitButton';
import Form from 'components/Form/Form';
import axiosClient from 'api/axiosClient';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';

type Files = FileList | null;

const Home: NextPage = () => {
   const [uploading, setUploading] = useState(false);
   const [currentFiles, setCurrentFiles] = useState<Files>();
   const fileuploadRef = useRef<HTMLInputElement>(null);
   const router = useRouter();
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();

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
      getBase64(file, (result: any) => {
         formData.append('base64', result);
      });

      const config = {
         headers: { 'content-type': 'multipart/form-data' },
      };

      await axiosClient
         .post('/api/upload', formData, config)
         .then(async (res: AxiosResponse) => {
            setUploading(false);
            const clipboard = navigator?.clipboard;
            if (clipboard) {
               console.log(res.data);
               await clipboard.writeText(res.data).catch((err) => {});
            }
            updateSuccessWidgit?.showSuccessWidgit(
               'File uploaded!' + (clipboard ? ' Copied to clipboard' : ''),
            );
            router.push(res.data);
         })
         .catch((err: AxiosError) => {
            setUploading(false);
            updateErrorWidgit?.showErrorWidgit(
               'Upload failed\n' + err.response?.statusText,
            );
         })
         .finally(() => {
            setUploading(false);
         });
   }

   function getBase64(file: any, cb: any) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
         cb(reader.result);
      };
      reader.onerror = function (error) {
         console.log('Error: ', error);
      };
   }

   return (
      <>
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
