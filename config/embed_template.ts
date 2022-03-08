/* If true, send a webhook */
const sendWebhook: boolean = false;

const webhooknotification: string = '';

/* 
  -------------- VARIABLES --------------
   {originalfilename}: Original filename
   {shortname}: Short filename
   {shortURL}: Short URL
   {path}: Server Path to file
   {mimetype}: Mimetype of file
   {username}: Username of uploader
*/

interface NewUploadEmbed {
   title: string;
   color: number /* HEX INTEGER */;
   description: string;
   id: number;
}

const newUploadEmbed: NewUploadEmbed = {
   title: 'New file uploaded',
   color: 2096896,
   description:
      '**OriginalFilename**: ```{originalfilename}```' +
      '\n**Shortname**: ```{shortname}```' +
      '\n**ShortURL**: ```{shortURL}```' +
      '\n**Path**: ```{path}```' +
      '\n**Mimetype**: ```{mimetype}```' +
      '\n**Username**: ```{username}```',
   id: 0,
};

export { newUploadEmbed, webhooknotification, sendWebhook };
export type { NewUploadEmbed };
