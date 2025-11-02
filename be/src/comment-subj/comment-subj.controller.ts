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

  @Patch(':idUser/:idCommentSubj')
  update(
    @Param('idUser') idUser: string,
    @Param('idCommentSubj') idCommentSubj: string,
  ) {
    return this.commentSubjService.updateAfterVerification(+idUser, +idCommentSubj);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentSubjService.remove(+id);
  }

}
