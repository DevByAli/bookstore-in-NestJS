import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { AddTagDto } from './dto/addTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  addTag(@Body() addTagDto: AddTagDto) {
    return this.tagService.addTag(addTagDto);
  }

  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }

  @Patch(':id')
  updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string){
    return await this.tagService.deleteTag(id)
  }
}
