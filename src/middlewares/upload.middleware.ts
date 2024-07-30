import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { fileFilter } from 'src/utils/fileFilter';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private folder: string;

  constructor(folder: string) {
    this.folder = folder;
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Set up Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
      secure: true,
    });

    const upload = multer({
      storage: new CloudinaryStorage({
        cloudinary,
        params: {
          folder: this.folder,
        } as {[key: string]: string},
      }),
      fileFilter,
      limits: { fileSize: 1 * 1024 * 1024 }, // set file size limit to 1 MB
    }).any();

    upload(req, res, (err) => {
      if (err) {
        throw new BadRequestException(err.message);
      }

      if (!req.files || req.files.length === 0) {
        throw new BadRequestException('Image not provided');
      }

      next();
    });
  }
}
