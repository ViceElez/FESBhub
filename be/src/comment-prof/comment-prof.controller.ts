import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';

@Controller('comment-prof')
export class CommentProfController {
  constructor(private readonly commentProfService: CommentProfService) {}

  @Post()
  create(@Body() createCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.create(createCommentProfDto);
  }

  @Get()
  findAll() {
    return this.commentProfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentProfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentProfDto: UpdateCommentProfDto) {
    return this.commentProfService.update(+id, updateCommentProfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentProfService.remove(+id);
  }
}
