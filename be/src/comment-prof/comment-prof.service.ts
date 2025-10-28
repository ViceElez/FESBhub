import { Body, Injectable } from '@nestjs/common';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class CommentProfService {
  constructor(private prisma: PrismaService) {}

  create(@Body() createCommentProfDto: CreateCommentProfDto) {

    const { content, userId, professorId } = createCommentProfDto;
    return this.prisma.commentOnProffessor.create({
      data: {
        content,
        userId,
        professorId,
      },
    });
  }

  update(idUser: number, idCommentProf: number, updateCommentProfDto: UpdateCommentProfDto) {
    if(this.prisma.user.findUnique(
      {where: {id: idUser},
      select: {isAdmin: true}}) == null){
      throw new Error('User not found');
    }
    if(this.prisma.commentOnProffessor.findUnique({where: {id: idCommentProf}}) == null){
      throw new Error('Comment not found');
    }
    return this.prisma.commentOnProffessor.update({
      where: { id: idCommentProf },
      data: { isVerified: true},
    });
  }

}

