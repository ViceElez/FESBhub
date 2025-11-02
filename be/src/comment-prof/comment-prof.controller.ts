import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';

@Controller('comment-prof')
export class CommentProfController {
  constructor(private readonly commentProfService: CommentProfService) {}

  @Post(':idUser')
  create(@Param('idUser') idUser: string, @Body() createCommentProfDto: CreateCommentProfDto) {
    return this.commentProfService.create(createCommentProfDto);
  }

  @Patch(':idUser/:idCommentProf')
  update(
    @Param('idUser') idUser: string,
    @Param('idCommentProf') idCommentProf: string,
  ) {
    return this.commentProfService.updateVerification(+idUser, +idCommentProf);
  }

  @Get()
  findAll() {
    return this.commentProfService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentProfService.remove(+id);
  }

}

