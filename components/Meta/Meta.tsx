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
         videoRawPath?: string;
         videomimetype?: string;
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
         {meta.uploadmeta?.videoRawPath && (
            <>
               <meta
                  property='og:video'
                  content={meta.uploadmeta?.videoRawPath}
               />
               <meta
                  property='og:video:url'
                  content={meta.uploadmeta?.videoRawPath}
               />
               <meta property='og:type' content='video.other' />
            </>
         )}

         {meta.uploadmeta?.videomimetype && (
            <meta
               property='og:video:type'
               content={meta.uploadmeta?.videomimetype}
            />
         )}

         <meta name='twitter:card' content='summary_large_image'></meta>
      </Head>
   );
}
export default Meta;
