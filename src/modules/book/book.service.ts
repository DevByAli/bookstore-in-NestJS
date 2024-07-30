import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book } from './schemas/book.schema';
import { AddBookDto } from './dto/addBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { GetAllBooksDto } from './dto/getAllBooks.dto';
import { SearchBooksDto } from './dto/searchBook.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async addBook(addBookDto: AddBookDto) {
    return await this.bookModel.create(addBookDto);
  }

  async updateBook(bookId: string, updateBookDto: UpdateBookDto) {
    return await this.bookModel.findByIdAndUpdate(bookId, updateBookDto, {
      new: true,
      runValidators: true,
    });
  }

  async getBook(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    
    return book;
  }

  async getBooks(getAllBooksDto: GetAllBooksDto) {
    const { pageNumber, pageSize, sortBy, order } = getAllBooksDto;

    const sort = { [sortBy]: order };

    const totalBookCount = await this.bookModel.countDocuments();
    const totalPages = Math.ceil(totalBookCount / pageSize);

    const skip = (pageNumber - 1) * pageSize;
    const hasNextPage = skip * pageSize < totalPages;

    const books = await this.bookModel
      .find()
      .skip(skip)
      .limit(pageSize)
      .sort(sort);

    return {
      books,
      hasNextPage,
      totalPages,
    };
  }

  async searchBooks(searchBooksDto: SearchBooksDto) {
    const { query, sortBy, order, pageNumber, pageSize, deepSearch } =
      searchBooksDto;

    const regex = new RegExp(query, 'i');

    let searchCriteria: Array<{ [key: string]: { $regex: RegExp } }> = [
      { title: { $regex: regex } },
      { author: { $regex: regex } },
    ];

    if (deepSearch) {
      searchCriteria.push(
        { tags: { $regex: regex } },
        { description: { $regex: regex } },
      );
    }

    const sort = { [sortBy]: order };

    const skip = (pageNumber - 1) * pageSize;

    const books = await this.bookModel
      .find({ $or: searchCriteria })
      .skip(skip)
      .limit(pageSize)
      .sort(sort);

    const totalBooksCount = await this.bookModel.countDocuments({
      $or: searchCriteria,
    });

    const totalPages = Math.ceil(totalBooksCount / pageSize);
    const hasNextPage = pageNumber < totalPages;

    return {
      books,
      hasNextPage,
      totalPages,
    };
  }

  async getBookByTitle(title: string) {
    return await this.bookModel.findOne({ title });
  }

  async getBooksByIds(bookIdsList: Array<string>) {
    return await this.bookModel.find({ _id: { $in: bookIdsList } });
  }
}
