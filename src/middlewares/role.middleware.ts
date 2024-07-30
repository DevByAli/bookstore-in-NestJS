import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private allowedRoles: string[]) {}

  use(req: Request, res: Response, next: Function) {
    const { role } = req.user;

    if (!this.allowedRoles.includes(role)) {
      const msg = `Access denied. The role '${role}' does not have permission to access this resource.`;
      throw new ForbiddenException(msg);
    }

    next();
  }
}
