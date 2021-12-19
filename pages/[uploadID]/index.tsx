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
}

const Upload: NextPage<SiteProps> = ({ uploadID, contentType, filename }) => {
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
                  imageRawPath: `${server}/api/upload/${uploadID}`,
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
               <Link href={`${server}/api/upload/${uploadID}`}>Download</Link>
            </>
         )}
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
      },
   };
};

export default Upload;
