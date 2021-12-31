import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import { server } from 'config/api';
import Link from 'next/link';
import { Uploads } from 'types/Dashboard';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import { FixedSizeList as List } from 'react-window';

function FileUpload({
   uploadFiles,
   setUploadFiles,
}: {
   uploadFiles: Uploads[];
   setUploadFiles: any;
}) {
   return (
      <>
         {uploadFiles?.length ? (
            uploadFiles.map((upload, index) => {
               return (
                  <Upload
                     key={index}
                     name={upload.name}
                     filename={upload.filename}
                     originalFilename={upload.originalfilename}
                     path={upload.path}
                     mimetype={upload.mimetype}
                     setUploadFiles={setUploadFiles}
                  />
               );
            })
         ) : (
            <>
               <h4 style={{ margin: '10px' }}>No uploads yet</h4>
               <Link href='/' passHref>
                  <p
                     className='button button-blue'
                     style={{ marginTop: '5px' }}
                  >
                     Upload something
                  </p>
               </Link>
            </>
         )}
      </>
   );
}

const Upload = (upload: {
   name: string;
   filename: string;
   originalFilename: string;
   path: string;
   mimetype: string;
   setUploadFiles: any;
}) => {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();
   function deleteUpload(name: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${name}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/uploads?filename=${name}`)
            .then(async () => {
               updateSuccessWidgit?.showSuccessWidgit(`${name} deleted`);
               const uploads = await axiosClient.get(
                  server + '/api/dashboard/uploads',
                  {
                     withCredentials: true,
                  },
               );
               if (uploads.data) {
                  upload.setUploadFiles(uploads.data);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(error.message);
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{upload.name}</DashboardName>
         <div>{upload.originalFilename}</div>
         <DashboardButtons>
            <Link href={'/' + upload.name} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <Link
               href={'/api/upload/' + upload.name + '?download=true'}
               passHref
            >
               <p className='button button-blue'>Download</p>
            </Link>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteUpload(upload.name);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
};

export default FileUpload;
