import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MailService } from 'src/shared/services/mail.service';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { UploadMiddleware } from 'src/middlewares/upload.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, MailService, CloudinaryService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(() => new UploadMiddleware("Avatars"))
      .forRoutes('user/update-avatar');
  }
}
