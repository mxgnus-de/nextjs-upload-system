import { validateUploadKey } from 'api/uploadKey';
import Container from 'components/Container/Container';
import Meta from 'components/Meta/Meta';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface SiteProps {
   shortedLink: string;
   url: string;
   isLoggedIn: boolean;
}

const Upload: NextPage<SiteProps> = ({ shortedLink, url, isLoggedIn }) => {
   const router = useRouter();
   useEffect(() => {
      if (url) {
         router.push(url);
      }
   }, [router, url]);

   return (
      <Container>
         <Meta
            meta={{
               title: 'Upload • ' + shortedLink,
               url: `${process.env.NEXT_PUBLIC_URL}/l/${shortedLink}`,
            }}
         />
         <h4>Redirect</h4>
         <p>Don&apos;t get redirected?</p>
         <p>
            <Link href={url}>{url}</Link>
         </p>
         {isLoggedIn && (
            <Link
               href={`${process.env.NEXT_PUBLIC_URL}/dashboard/links?id=${shortedLink}`}
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
      </Container>
   );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
   const { link } = context.query;
   const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/links/${link}`);
   const data = await res.json();
   const isLoggedIn = await validateUploadKey(
      context.req.cookies['upload_key'] || '',
   );

   if (res.status !== 200) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         shortedLink: link,
         url: data.url,
         isLoggedIn,
      },
   };
};

export default Upload;
