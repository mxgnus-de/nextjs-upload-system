import { Request, Response, NextFunction } from 'express';

export async function middleware(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   return next();
}
