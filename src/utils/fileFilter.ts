import { HttpException, HttpStatus } from '@nestjs/common';
import multer from 'multer';

export const fileFilter = (
  _,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    throw new HttpException(
      'Only .png, .jpg, and .jpeg format allowed!',
      HttpStatus.BAD_REQUEST,
    );
  }
};
