import { NextFunction, Request, Response } from 'express';

export interface IPolicy {
  handle(request: Request, response: Response, next: NextFunction);
}
