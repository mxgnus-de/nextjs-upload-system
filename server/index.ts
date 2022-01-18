import { devenv, port } from '../config/api';
import cookies from 'cookies';
import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import ConsoleLogger from '../utils/consolelogger';
import { middleware } from './middleware/middleware';
import apirouter from './routes/apiroute';
import '../api/db/mysql';
import path from 'path';
import { paths } from '../config/upload';
import fs from 'fs';

const app = next({
   dev: devenv,
   conf: {
      reactStrictMode: true,
      poweredByHeader: false,
   },
});
const handle = app.getRequestHandler();

async function main() {
   if (!fs.existsSync(paths.files)) fs.mkdirSync(paths.files);
   if (!fs.existsSync(paths.upload)) fs.mkdirSync(paths.upload);
   await app.prepare().catch((err) => new ConsoleLogger(err).error());
   const server = express();
   server.use(express.json());

   server.disable('x-powered-by');
   server.set('port', port);
   server.use(cookies.express(['keyA', 'keyB', 'keyC']));
   server.use(middleware);
   server.use(logRequest);
   server.use('/api', apirouter);
   server.use(express.static(paths.files));

   server.all('*', (req: Request, res: Response) => handle(req, res));

   server.listen(port, (err?: any) => {
      if (err) {
         new ConsoleLogger(err).error(true);
         throw err;
      }
      new ConsoleLogger(`Ready on http://localhost:${port}`).info();
   });
}

function logRequest(req: Request, res: Response, next: NextFunction) {
   if (!req.path.startsWith('/api')) return next();
   new ConsoleLogger(
      '[' +
         req.method +
         '] ' +
         (req.headers['x-forwarded-for'] || req.socket.remoteAddress) +
         ': ' +
         req.path,
   ).info(false);
   next();
}

main();