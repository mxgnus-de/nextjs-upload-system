const devenv = process.env.NODE_ENV === 'development';

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
*/

interface NewUploadEmbed {
   title: string;
   color: number /* HEX INTEGER */;
   description: string;
   id: number;
}

const newUploadEmbed: NewUploadEmbed = {
   title: devenv ? 'New file uploaded [DEV]' : 'New file uploaded',
   color: 0,
   description: '',
   id: 0,
};

export { newUploadEmbed, webhooknotification, sendWebhook };
export type { NewUploadEmbed };
