import { validateUploadKey } from 'api/uploadKey';
import Container from 'components/Container/Container';
import Meta from 'components/Meta/Meta';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { isAudio, isImage, isVideo } from 'utils/mimetypechecker';

interface SiteProps {
   uploadID: string;
   contentType: string;
   filename: string;
   isLoggedIn: boolean;
}

const Upload: NextPage<SiteProps> = ({
   uploadID,
   contentType,
   filename,
   isLoggedIn,
}) => {
   return (
      <Container>
         <Meta
            meta={{
               title:
                  'Upload • ' +
                  (isImage(contentType)
                     ? 'Image'
                     : isVideo(contentType)
                     ? 'Video'
                     : isAudio(contentType)
                     ? 'Audio'
                     : 'File') +
                  ' • ' +
                  uploadID,
               image: `${server}/${uploadID}`,
               url: `${server}/${uploadID}`,
               uploadmeta: {
                  imageRawPath: isImage(contentType)
                     ? `${server}/api/upload/${uploadID}`
                     : undefined,
                  videoRawPath: isVideo(contentType)
                     ? `${server}/api/upload/${uploadID}`
                     : undefined,
                  videomimetype: isVideo(contentType) ? contentType : undefined,
               },
            }}
         />
         <h4 style={{ margin: '20px' }}>{filename}</h4>
         {isImage(contentType) ? (
            <ImageElement uploadID={uploadID} />
         ) : isVideo(contentType) ? (
            <VideoElement uploadID={uploadID} />
         ) : isAudio(contentType) ? (
            <AudioElement uploadID={uploadID} />
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
         <Link href={`${server}/api/upload/${uploadID}?download=true`} passHref>
            <span style={{ margin: '20px' }} className='pointer'>
               Download
            </span>
         </Link>
      </Container>
   );
};

function ImageElement({ uploadID }: { uploadID: string }) {
   return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
         style={{ maxWidth: '100%', maxHeight: '100%' }}
         src={`${server}/api/upload/${uploadID}`}
         alt={`${server}/api/upload/${uploadID}`}
      />
   );
}

function VideoElement({ uploadID }: { uploadID: string }) {
   return (
      <video
         style={{ maxWidth: '100%', maxHeight: '100%' }}
         src={`${server}/api/upload/${uploadID}`}
         autoPlay
         controls
      />
   );
}

function AudioElement({ uploadID }: { uploadID: string }) {
   return (
      <audio controls>
         <source src={`${server}/api/upload/${uploadID}`} />
      </audio>
   );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
   const { uploadID } = context.query;
   const res = await fetch(`${server}/api/upload/${uploadID}`);
   const isLoggedIn = await validateUploadKey(
      context.req.cookies['upload_key'],
   );

   if (res.status !== 200) {
      return {
         notFound: true,
      };
   }

   const mimetype = res.headers.get('Content-Type');
   return {
      props: {
         uploadID,
         contentType: mimetype,
         filename: res.headers.get('filename'),
         isLoggedIn,
      },
   };
};

export default Upload;
