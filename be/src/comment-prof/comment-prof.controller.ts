import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { DeleteCommentProfDto } from './dto/delete-comment-prof.dto';

@Controller('comment-prof')
export class CommentProfController {
  constructor(private readonly commentProfService: CommentProfService) {}

  @Post()
  create(@Body() createCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.create(createCommentProfDto);
  }

  @Patch()
  update(@Body() updateCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.updateVerification(updateCommentProfDto);
  }

  @Get()
  findAll() {
    return this.commentProfService.findAll();
  }

  @Delete()
  remove(@Body() deleteCommentProfDto: DeleteCommentProfDto) {
    return this.commentProfService.remove(deleteCommentProfDto);
  }

}

