import Container from 'components/Container/Container';
import Meta from 'components/Meta/Meta';
import { server } from 'config/api';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface SiteProps {
   shortedLink: string;
   url: string;
}

const Upload: NextPage<SiteProps> = ({ shortedLink, url }) => {
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
               url: `${server}/links/${shortedLink}`,
            }}
         />
         <h4>Redirect</h4>
         <p>Don&apos;t get redirected?</p>
         <p>
            <Link href={url}>{url}</Link>
         </p>
      </Container>
   );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
   const { link } = context.query;
   const res = await fetch(`${server}/api/links/${link}`);
   const data = await res.json();

   if (res.status !== 200) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         shortedLink: link,
         url: data.url,
      },
   };
};

export default Upload;
