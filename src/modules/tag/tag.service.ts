import { BadRequestException, Injectable } from '@nestjs/common';
import { Tag } from './schemas/tag.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddTagDto } from './dto/addTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  addTag(addTagDto: AddTagDto) {
    return this.tagModel.create(addTagDto);
  }

  getAllTags() {
    return this.tagModel.find().exec();
  }

  updateTag(id: string, updateTagDto: UpdateTagDto) {
    return this.tagModel.findByIdAndUpdate(id, updateTagDto);
  }

  async deleteTag(id: string) {
    const deleteTag = await this.tagModel.findByIdAndDelete(id);
    if (!deleteTag) {
      throw new BadRequestException('Tag not found.');
    }

    return deleteTag;
  }
}
