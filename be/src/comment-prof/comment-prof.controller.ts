import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { DeleteCommentProfDto } from './dto/delete-comment-prof.dto';
import { UserGuard, AdminGuard } from '../guards';

@Controller('comment-prof')
export class CommentProfController {
  constructor(private readonly commentProfService: CommentProfService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Body() createCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.create(createCommentProfDto);
  }

  @UseGuards(UserGuard)
  @Patch()
  update(@Body() updateCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.updateComment(updateCommentProfDto);
  }

  @UseGuards(UserGuard)
  @Get('exists')
  findUnique(@Query('profId') profId: number, @Query('userId') userId: number) {
    return this.commentProfService.Exists(+profId, +userId);
  }

  @UseGuards(AdminGuard)
  @Get('all')
  findUnverified() {
    return this.commentProfService.findUnverified();
  }

  @UseGuards(AdminGuard)
  @Patch('verify')
  updateVerification(@Body() updateCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.updateVerification(updateCommentProfDto);
  }
  
  @UseGuards(UserGuard)
  @Delete()
  remove(@Body() deleteCommentProfDto: DeleteCommentProfDto) {
    return this.commentProfService.remove(deleteCommentProfDto);
  }

}

