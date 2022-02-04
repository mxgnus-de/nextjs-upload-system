export interface Uploads {
   name: string;
   filename: string;
   originalfilename: string;
   path: string;
   mimetype: string;
}

export interface ShortURL {
   name: string;
   url: string;
}

export interface User {
   key: string;
   username: string;
}

export interface Settings {
   name: string;
   value: 'true' | 'false';
}

export interface Haste {
   id: string;
   haste: string;
   language: string | null;
}
