import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { BookService } from './book.service';
import { AddBookDto } from './dto/addBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { SearchBooksDto } from './dto/searchBook.dto';
import { GetAllBooksDto } from './dto/getAllBooks.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  addBook(@Body() addBookDto: AddBookDto) {
    return this.bookService.addBook(addBookDto);
  }

  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Get()
  getBooks(@Query() getAllBooksDto: GetAllBooksDto) {
    return this.bookService.getBooks(getAllBooksDto);
  }

  @Post('upload-cover')
  uploadCover(@Req() req: Request) {
    const { path } = req.files[0];
    const cloudinaryId = path.split('/').pop();

    return { url: path, cloudinaryId };
  }

  @Get('search')
  searchBooks(@Query() searchBooksDto: SearchBooksDto) {
    return this.bookService.searchBooks(searchBooksDto);
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    return await this.bookService.getBook(id);
  }
}
