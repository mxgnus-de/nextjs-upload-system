import cookies from 'cookies';
import express, { Request, Response } from 'express';
import next from 'next';
import ConsoleLogger from '../utils/consolelogger';
import { middleware } from './middleware/middleware';
import apirouter from './routes/apiroute';
import { paths } from '../config/upload';
import fs from 'fs';
import mainroute from './routes/mainroute';
import { init as initDB } from '../api/db/init';

const port =
   typeof process.env.PORT === 'string'
      ? parseInt(process.env.PORT)
      : process.env.PORT;

const app = next({
   dev: process.env.NODE_ENV !== 'production',
   conf: {
      reactStrictMode: true,
      poweredByHeader: false,
      compiler: {
         styledComponents: true,
      },
   },
   hostname: process.env.NEXT_PUBLIC_DOMAIN,
   port,
});

if (!process.env.PORT) {
   new ConsoleLogger('PORT is not defined, check out the .env file').error();
   process.exit(1);
} else if (!process.env.NEXT_PUBLIC_URL) {
   new ConsoleLogger(
      'NEXT_PUBLIC_URL is not defined, check out the .env file',
   ).error();
   process.exit(1);
} else if (!process.env.NEXT_PUBLIC_DOMAIN) {
   new ConsoleLogger(
      'NEXT_PUBLIC_DOMAIN is not defined, check out the .env file',
   ).error();
   process.exit(1);
} else if (!process.env.NEXT_PUBLIC_PROTOCOL) {
   new ConsoleLogger(
      'NEXT_PUBLIC_PROTOCOL is not defined, check out the .env file',
   ).error();
   process.exit(1);
} else if (!process.env.DATABASE_URL) {
   new ConsoleLogger(
      'DATABASE_URL is not defined, check out the .env file',
   ).error();
   process.exit(1);
}

const handle = app.getRequestHandler();

async function main() {
   if (!fs.existsSync(paths.files)) fs.mkdirSync(paths.files);
   if (!fs.existsSync(paths.upload)) fs.mkdirSync(paths.upload);
   await app.prepare().catch((err) => new ConsoleLogger(err).error());
   const server = express();
   server.use(express.json());

   server.disable('x-powered-by');
   server.set('port', process.env.PORT);
   server.use(cookies.express(['keyA', 'keyB', 'keyC']));
   server.use(middleware);
   server.use('/api', apirouter);
   server.use('/', mainroute);
   server.use(express.static(paths.files));

   server.all('*', (req: Request, res: Response) => handle(req, res));

   server.listen(process.env.PORT, (err?: any) => {
      initDB();
      if (err) {
         new ConsoleLogger(err).error(true);
         throw err;
      }
      new ConsoleLogger(`Ready on http://localhost:${process.env.PORT}`).info();
   });
}

main();
