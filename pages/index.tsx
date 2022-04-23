/* eslint-disable @next/next/no-img-element */
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

type Files = File | null;

const Home: NextPage = () => {
   const [uploading, setUploading] = useState<{
      state: 'idle' | 'uploading' | 'done' | 'error';
      progress: number | null;
   }>({
      state: 'idle',
      progress: null,
   });
   const [currentFiles, setCurrentFiles] = useState<Files>();
   const fileuploadRef = useRef<HTMLInputElement>(null);
   const router = useRouter();
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();

   useEffect(() => {
      setCurrentFiles(null);
   }, []);

   async function uploadFile() {
      const file = currentFiles;
      if (!file) {
         fileuploadRef.current?.click();
         fileuploadRef.current?.focus();
         return;
      }
      setUploading((prevState) => ({
         ...prevState,
         state: 'uploading',
      }));
      const formData = new FormData();
      formData.append('file', file);

      const config: AxiosRequestConfig<FormData> = {
         headers: { 'content-type': 'multipart/form-data' },
         onUploadProgress: (e) => {
            setUploading((prevState) => ({
               ...prevState,
               progress: Math.round((e.loaded * 100) / e.total),
            }));
         },
      };

      await axiosClient
         .post('/api/upload', formData, config)
         .then(async (res: AxiosResponse) => {
            setUploading((prevState) => ({
               ...prevState,
               state: 'done',
            }));
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
            setUploading((prevState) => ({
               ...prevState,
               state: 'error',
            }));
            updateErrorWidget?.showErrorWidget(
               'Upload failed.\n' +
                  (err.response?.data?.message || err.response?.statusText),
            );
         })
         .finally(() => {
            setUploading((prevState) => ({
               ...prevState,
               progress: null,
            }));
         });
   }

   return (
      <>
         {uploading.progress && (
            <LinearProgress value={uploading.progress} variant='determinate' />
         )}
         <Meta
            meta={{
               title:
                  uploading.state === 'uploading'
                     ? 'Upload • In progress'
                     : uploading.state === 'done'
                     ? 'Upload • Done'
                     : uploading.state === 'error'
                     ? 'Upload • Error'
                     : 'Upload • Home',
            }}
         />
         <Navbar />
         <Container>
            <Wrapper>
               <h1>
                  {uploading.state === 'uploading' ? (
                     <UploadAnimation />
                  ) : (
                     'Upload'
                  )}
               </h1>
               <Hyphen className='text-muted' />
               <Form>
                  <label htmlFor='inputfile'>File</label>
                  <Input
                     type='file'
                     ref={fileuploadRef}
                     onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                           const item = e.target.files.item(0);
                           if (!item) setCurrentFiles(null);
                           else setCurrentFiles(item);
                           return;
                        }
                        setCurrentFiles(null);
                     }}
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
               <FilePreview>
                  <PreviewFileRenderer file={currentFiles} />
               </FilePreview>
            </Wrapper>
         </Container>
      </>
   );
};

function PreviewFileRenderer({ file }: { file: File | null | undefined }) {
   if (!file) {
      return <h5 className='text-muted'>No files selected</h5>;
   }

   if (file.type.startsWith('image')) {
      return (
         <>
            <h5>{file.name}</h5>
            <img
               src={URL.createObjectURL(file)}
               alt='preview'
               style={{
                  maxWidth: '100%',
               }}
            />
            <h5 className='text-muted'>{file.type}</h5>
         </>
      );
   } else if (file.type.startsWith('video')) {
      return (
         <>
            <h5>{file.name}</h5>
            <video
               src={URL.createObjectURL(file)}
               controls
               style={{
                  maxWidth: '100%',
               }}
            />
            <h5 className='text-muted'>{file.type}</h5>
         </>
      );
   } else if (file.type.startsWith('audio')) {
      return (
         <>
            <h5>{file.name}</h5>
            <audio src={URL.createObjectURL(file)} controls />
            <h5 className='text-muted'>{file.type}</h5>
         </>
      );
   } else {
      return (
         <>
            <h5>{file.name}</h5>
            <h5 className='text-muted'>{file.type}</h5>
         </>
      );
   }
}

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

const FilePreview = styled.div`
   margin-top: 2em;
`;

export default Home;
