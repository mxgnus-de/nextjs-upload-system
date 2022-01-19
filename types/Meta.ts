export interface Meta {
   onlyShowVideoData?: true;
   title: string;
   description?: string;
   keywords?: string;
   image?: string;
   url?: string;
   themecolor?: string;
   robots?: 'noindex';
   uploadmeta?: {
      imageRawPath?: string;
      videoRawPath?: string;
      videomimetype?: string;
      type?: string;
   };
}
