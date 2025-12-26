import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Query} from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { DeleteCommentProfDto } from './dto/delete-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';
import { UserGuard, AdminGuard } from '../guards';

@UseGuards(UserGuard)
@Controller('comment-prof')
export class CommentProfController {
  constructor(private readonly commentProfService: CommentProfService) {}

  @Post()
  create(@Body() createCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.create(createCommentProfDto);
  }

  @Patch()
  update(@Body() updateCommentProfDto: UpdateCommentProfDto) {
    return this.commentProfService.updateComment(updateCommentProfDto);
  }

  @Get('exists')
  findUnique(@Query('profId') profId: number, @Query('userId') userId: number) {
    return this.commentProfService.Exists(+profId, +userId);
  }

  @Get('all')
  findUnverified() {
    return this.commentProfService.findUnverified();
  }

  @Patch('verify')
  updateVerification(@Body() updateCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.updateVerification(updateCommentProfDto);
  }

  @Delete()
  remove(@Body() deleteCommentProfDto: DeleteCommentProfDto) {
    return this.commentProfService.remove(deleteCommentProfDto);
  }

  @Get('verified')
  findVerified(@Query('profId') profId: number) {
    return this.commentProfService.findVerified(+profId);
  }

  @Get('verified/all')
  findAllVerified() {
    return this.commentProfService.findAllVerified();
  }

}

