import defaultMeta from 'config/meta';
import Head from 'next/head';
import React from 'react';
import { Meta as IMeta } from 'types/Meta';

function Meta({ meta }: { meta: IMeta }) {
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
            property='og:description'
            content={meta.description ? meta.title : defaultMeta.description}
         />
         {!meta.onlyShowVideoData ? (
            <>
               <meta name='twitter:card' content='summary_large_image'></meta>
               <meta
                  name='theme-color'
                  content={
                     meta.themecolor ? meta.themecolor : defaultMeta.themecolor
                  }
               />
            </>
         ) : null}

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
               <meta
                  property='og:video:secure_url'
                  content={meta.uploadmeta?.videoRawPath}
               />
            </>
         )}

         {meta.uploadmeta?.videomimetype && (
            <meta
               property='og:video:type'
               content={meta.uploadmeta?.videomimetype}
            />
         )}

         {meta.uploadmeta?.type && (
            <meta property='og:type' content={meta.uploadmeta?.type} />
         )}

         {meta.robots && <meta name='robots' content={meta.robots} />}
      </Head>
   );
}
export default Meta;
