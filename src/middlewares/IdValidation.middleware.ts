import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class IdValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID in request parameter!');
    }

    next();
  }
}
