import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request...`);

    const authorization = req.headers['authorization'];

    if (authorization) {
      req['user'] = {
        token: authorization
      }
      return next();

    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}