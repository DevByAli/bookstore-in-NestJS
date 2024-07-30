import { PartialType } from '@nestjs/mapped-types';
import { AddBookDto } from './addBook.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {}
