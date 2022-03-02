import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import { server, serverdomain } from 'config/api';
import Link from 'next/link';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import { isAudio, isImage, isVideo } from 'utils/mimetypechecker';
import { File } from '@prisma/client';
import { FileOwner } from 'types/Dashboard';
import DashboardInfo from './DashboardInfo';

function FileUpload({
   uploadFiles,
   setUploadFiles,
}: {
   uploadFiles: FileOwner[];
   setUploadFiles: any;
}) {
   return (
      <>
         {uploadFiles?.length ? (
            uploadFiles.map((upload, index) => {
               return (
                  <Upload
                     key={index}
                     file={{ ...upload, setUploadFiles: setUploadFiles }}
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

interface UploadProps extends FileOwner {
   setUploadFiles: any;
}

const Upload = ({ file }: { file: UploadProps }) => {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();
   function deleteUpload(name: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${name}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/uploads?filename=${name}`)
            .then(async () => {
               updateSuccessWidget?.showSuccessWidget(`${name} deleted`);
               const uploads = await axiosClient.get(
                  server + '/api/dashboard/uploads',
                  {
                     withCredentials: true,
                  },
               );
               if (uploads.data) {
                  file.setUploadFiles(uploads.data);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidget?.showErrorWidget(error.message);
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   const downloadName = file.path
      .replaceAll('//', '/')
      .replaceAll('\\', '/')
      .split('/')[
      file.path.replaceAll('//', '/').replaceAll('\\', '/').split('/').length -
         1
   ];
   const downloadURL =
      server +
      '/uploads/' +
      (isImage(file.mimetype)
         ? 'images'
         : isAudio(file.mimetype)
         ? 'audios'
         : isVideo(file.mimetype)
         ? 'videos'
         : 'data') +
      '/' +
      downloadName;
   return (
      <DashboardItemWrapper>
         <DashboardName>{file.name}</DashboardName>
         <DashboardInfo>
            {file.ownerName ? (
               <Link href={'/dashboard/users#' + file.ownerId}>
                  {file.ownerName}
               </Link>
            ) : (
               'Unknown'
            )}
         </DashboardInfo>
         <DashboardInfo>{file.originalfilename}</DashboardInfo>
         <DashboardButtons>
            <Link href={'/' + file.name} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <a
               href={downloadURL}
               download={serverdomain + downloadName}
               target={'_blank'}
               rel='noreferrer'
            >
               <p className='button button-blue'>Download</p>
            </a>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteUpload(file.name);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
};

export default FileUpload;
