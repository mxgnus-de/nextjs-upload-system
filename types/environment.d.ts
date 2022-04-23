declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NODE_ENV: 'development' | 'production';
         PORT: number;
         NEXT_PUBLIC_PROTOCOL: string;
         NEXT_PUBLIC_DOMAIN: string;
         NEXT_PUBLIC_URL: string;
         DATABASE_URL: string;
         DISCORD_EMBED_WEBHOOK_ENABLED: boolean;
         DISCORD_EMBED_WEBHOOK_URL: string | undefined;
         DISCORD_EMBED_WEBHOOK_COLOR: string | undefined;
         DISCORD_EMBED_WEBHOOK_TITLE: string | undefined;
         DISCORD_EMBED_WEBHOOK_DESCRIPTION: string | undefined;
         META_DATA_TITLE: string;
         META_DATA_DESCRIPTION: string;
         META_DATA_THEMECOLOR: string;
      }
   }
}

export {};
