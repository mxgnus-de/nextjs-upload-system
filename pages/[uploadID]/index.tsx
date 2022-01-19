import axiosClient from 'api/axiosClient';
import { validateUploadKey } from 'api/uploadKey';
import Container from 'components/Container/Container';
import Meta from 'components/Meta/Meta';
import { server, serverdomain } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { isAudio, isImage, isVideo } from 'utils/mimetypechecker';

interface SiteProps {
   uploadID: string;
   mimetype: string;
   originalFilename: string;
   filename: string;
   fileextension: string;
   file_path: string;
   file_path_name: string;
   isLoggedIn: boolean;
}

const Upload: NextPage<SiteProps> = ({
   uploadID,
   fileextension,
   filename,
   file_path,
   mimetype,
   file_path_name,
   originalFilename,
   isLoggedIn,
}) => {
   return (
      <Container>
         <Meta
            meta={{
               title:
                  'Upload • ' +
                  (isImage(mimetype)
                     ? 'Image'
                     : isVideo(mimetype)
                     ? 'Video'
                     : isAudio(mimetype)
                     ? 'Audio'
                     : 'File') +
                  ' • ' +
                  uploadID,
               image: file_path,
               url: `${server}/${uploadID}`,
               uploadmeta: {
                  imageRawPath: isImage(mimetype) ? file_path : undefined,
                  videoRawPath: isVideo(mimetype) ? file_path : undefined,
                  videomimetype: isVideo(mimetype) ? mimetype : undefined,
                  type: isVideo(mimetype) ? 'video.other' : undefined,
               },
               /* onlyShowVideoData: isVideo(mimetype) ? true : undefined, */
               robots: 'noindex',
            }}
         />

         <h4 style={{ margin: '20px' }}>{originalFilename}</h4>
         {isImage(mimetype) ? (
            <ImageElement file_path={file_path} />
         ) : isVideo(mimetype) ? (
            <VideoElement file_path={file_path} />
         ) : isAudio(mimetype) ? (
            <AudioElement file_path={file_path} />
         ) : (
            <>
               <h5>File preview is not supported</h5>
            </>
         )}
         {isLoggedIn && (
            <Link
               href={`${server}/dashboard?id=${uploadID}&site=files`}
               passHref
            >
               <button
                  className='button button-blue'
                  style={{ marginTop: '20px' }}
               >
                  View in dashboard
               </button>
            </Link>
         )}
         <a
            href={file_path}
            download={serverdomain + '_' + file_path_name}
            style={{ margin: '20px' }}
            className='pointer'
            target='_blank'
            rel='noreferrer'
         >
            Download
         </a>
      </Container>
   );
};

function ImageElement({ file_path }: { file_path: string }) {
   return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
         style={{ maxWidth: '100%', maxHeight: '100%' }}
         src={file_path}
         alt={file_path}
      />
   );
}

function VideoElement({ file_path }: { file_path: string }) {
   return (
      <video
         style={{ maxWidth: '100%', maxHeight: '100%' }}
         src={file_path}
         autoPlay
         controls
      />
   );
}

function AudioElement({ file_path }: { file_path: string }) {
   return (
      <audio controls>
         <source src={file_path} />
      </audio>
   );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
   let error = false;
   const { uploadID } = context.query;
   const res = await axiosClient
      .get(`${server}/api/upload/${uploadID}`)
      .catch((err) => {
         error = true;
      });

   const isLoggedIn = await validateUploadKey(
      context.req.cookies['upload_key'],
   );

   if (error || !res || res.status !== 200 || !res.data) {
      return {
         notFound: true,
      };
   }
   const { data } = res;

   const mimetype = data.mime_type;
   const originalFilename = data.original_filename;
   const filename = data.file_name;
   const fileextension = data.file_extension;
   const file_path = data.file_path;
   const file_path_name = data.file_path_name;

   return {
      props: {
         uploadID,
         mimetype,
         originalFilename,
         filename,
         fileextension,
         file_path,
         file_path_name,
         isLoggedIn,
      },
   };
};

export default Upload;
