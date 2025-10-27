import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentSubjService } from './comment-subj.service';
import { CreateCommentSubjDto } from './dto/create-comment-subj.dto';
import { UpdateCommentSubjDto } from './dto/update-comment-subj.dto';

@Controller('comment-subj')
export class CommentSubjController {
  constructor(private readonly commentSubjService: CommentSubjService) {}

  @Post()
  create(@Body() createCommentSubjDto: CreateCommentSubjDto) {
    return this.commentSubjService.create(createCommentSubjDto);
  }

  @Get()
  findAll() {
    return this.commentSubjService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentSubjService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentSubjDto: UpdateCommentSubjDto) {
    return this.commentSubjService.update(+id, updateCommentSubjDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentSubjService.remove(+id);
  }
}
