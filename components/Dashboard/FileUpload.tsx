import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import Link from 'next/link';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import { isAudio, isImage, isVideo } from 'utils/mimetypechecker';
import { FileOwner } from 'types/Dashboard';
import DashboardInfo from './DashboardInfo';
import styled from 'styled-components';
import { Dispatch, SetStateAction, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';

function FileUpload({
   uploadFiles,
   setUploadFiles,
}: {
   uploadFiles: FileOwner[];
   setUploadFiles: Dispatch<SetStateAction<FileOwner[]>>;
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
   setUploadFiles: Dispatch<SetStateAction<FileOwner[]>>;
}

const Upload = ({ file }: { file: UploadProps }) => {
   const [filename, setFilename] = useState(file.alias || file.name);
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
                  process.env.NEXT_PUBLIC_URL + '/api/dashboard/uploads',
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

   async function changeFileAlias() {
      const confirm = window.confirm(
         `Are you sure you want to change the alias of ${file.name} to ${filename}?`,
      );

      if (confirm) {
         let error = false;
         const response = await axiosClient
            .put(
               process.env.NEXT_PUBLIC_URL +
                  '/api/dashboard/uploads?action=setalias',
               {
                  alias: filename,
                  filename: file.name,
               },
               {
                  withCredentials: true,
               },
            )
            .catch((err) => {
               error = true;
               updateErrorWidget?.showErrorWidget(
                  err.response?.data?.message ||
                     err.response?.statusText ||
                     'Could not change alias',
               );
            });

         if (error || !response) return;
         updateSuccessWidget?.showSuccessWidget(`${filename} changed`);
         if (response.data?.uploads) {
            file.setUploadFiles(response.data.uploads);
         }
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
      process.env.NEXT_PUBLIC_URL +
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

   const showSaveAlias = (): boolean => {
      if (file.alias) {
         return filename !== file.alias;
      } else {
         return filename !== file.name;
      }
   };
   return (
      <DashboardItemWrapper>
         <DashboardName>
            <FileName
               type='text'
               value={filename}
               onChange={(e) => {
                  setFilename(e.target.value);
               }}
            />
            {
               <SaveFileNameIcon
                  onClick={() => changeFileAlias()}
                  show={showSaveAlias().toString() as 'true' | 'false'}
               />
            }
         </DashboardName>
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
            <Link href={'/' + filename} passHref>
               <p className='button button-green'>View</p>
            </Link>
            <a
               href={downloadURL}
               download={process.env.NEXT_PUBLIC_DOMAIN + downloadName}
               target={'_blidk ank'}
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

const FileName = styled.input`
   background-color: transparent !important;
   color: #fff !important;
   font-weight: 400;
   font-size: 1rem;
   border: none;
   text-align: start !important;
`;

interface SaveFileNameIconProps {
   show: 'true' | 'false';
}

const SaveFileNameIcon = styled(CheckIcon)`
   path {
      color: #0cff04;
   }
   cursor: pointer;
   transition: all 0.3s ease;
   opacity: ${(props: SaveFileNameIconProps) =>
      props.show === 'true' ? 1 : 0};
   pointer-events: ${(props: SaveFileNameIconProps) =>
      props.show === 'true' ? 'auto' : 'none'};
`;

export default FileUpload;
