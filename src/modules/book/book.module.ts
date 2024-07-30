import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookSchema } from './schemas/book.schema';
import { UploadMiddleware } from 'src/middlewares/upload.middleware';
import { IdValidationMiddleware } from 'src/middlewares/IdValidation.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(() => new UploadMiddleware('BookCover'))
      .forRoutes('book/upload-cover')
      .apply(IdValidationMiddleware)
      .forRoutes('book/:id');
  }
}
