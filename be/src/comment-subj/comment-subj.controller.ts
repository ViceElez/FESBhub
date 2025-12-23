import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CommentSubjService } from './comment-subj.service';
import { CreateCommentSubjDto } from './dto/create-comment-subj.dto';
import { UpdateCommentSubjDto } from './dto/update-comment-subj.dto';
import { DeleteCommentSubjDto } from './dto/delete-comment-subj.dto';
import {UserGuard, AdminGuard} from "../guards";

@Controller('comment-subj')
export class CommentSubjController {
  constructor(private readonly commentSubjService: CommentSubjService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Body() createCommentSubjDto: CreateCommentSubjDto) {
    return this.commentSubjService.create(createCommentSubjDto);
  }

  @UseGuards(UserGuard)
  @Patch()
  update(@Body() updateCommentSubjDto: UpdateCommentSubjDto) {
    return this.commentSubjService.update(updateCommentSubjDto);
  }

  @UseGuards(UserGuard)
  @Delete()
  remove(@Body() deleteCommentSubjDto: DeleteCommentSubjDto) {
    return this.commentSubjService.remove(deleteCommentSubjDto);
  }

  @UseGuards(UserGuard)
  @Get('exists')
  findUnique(@Query('subjectId') subjectId: number, @Query('userId') userId: number) {
    return this.commentSubjService.Exists(+subjectId, +userId);
  }

  @UseGuards(UserGuard, AdminGuard)
  @Get('all')
  findUnverified() {
    return this.commentSubjService.findUnverified();
  }

  @UseGuards(UserGuard, AdminGuard)
  @Patch('verify')
  updateVerification(@Body() updateCommentSubjDto: UpdateCommentSubjDto) {
    return this.commentSubjService.updateAfterVerification(updateCommentSubjDto);
  }

}
