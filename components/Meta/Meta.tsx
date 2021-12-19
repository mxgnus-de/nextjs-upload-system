import defaultMeta from 'config/meta';
import Head from 'next/head';
import React from 'react';

function Meta({
   meta,
}: {
   meta: {
      title: string;
      description?: string;
      keywords?: string;
      image?: string;
      url?: string;
      themecolor?: string;
      uploadmeta?: {
         imageRawPath?: string;
      };
   };
}) {
   return (
      <Head>
         <title>{meta.title ? meta.title : defaultMeta.title}</title>
         <meta
            name='description'
            content={
               meta.description ? meta.description : defaultMeta.description
            }
         />
         <meta
            property='og:title'
            content={meta.title ? meta.title : defaultMeta.title}
         />
         <meta
            name='theme-color'
            content={meta.themecolor ? meta.themecolor : defaultMeta.themecolor}
         />
         {meta.uploadmeta?.imageRawPath && (
            <meta property='og:image' content={meta.uploadmeta?.imageRawPath} />
         )}

         <meta name='twitter:card' content='summary_large_image'></meta>
      </Head>
   );
}
export default Meta;
