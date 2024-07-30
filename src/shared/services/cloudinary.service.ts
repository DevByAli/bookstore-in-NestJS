import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async deleteImageResource(folderName: string, cloudinaryId: string) {
    if (cloudinaryId) {
      await cloudinary.api.delete_resources([`${folderName}/${cloudinaryId}`], {
        type: 'upload',
        resource_type: 'image',
      });
    }
  }
}
