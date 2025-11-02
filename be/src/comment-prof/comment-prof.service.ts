import { Body, Injectable } from '@nestjs/common';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class CommentProfService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createCommentProfDto: CreateCommentProfDto) {

    const NumberOfCommentsOnProfessor = await this.prisma.commentOnProffessor.count({
      where: {
        professorId: createCommentProfDto.professorId,
        userId: createCommentProfDto.userId,
      },
    });

    if(NumberOfCommentsOnProfessor > 1){
      throw new Error('User has already commented on this professor');
    }
    else{
      const { content, userId, professorId, rating } = createCommentProfDto;
      return this.prisma.commentOnProffessor.create({
        data: {
          content,
          userId,
          professorId,
          rating,
        },
      });
    }
  }

  async updateVerification(idUser: number, idCommentProf: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: idUser,
              isAdmin: true}
    });
    if (!user) {
      throw new Error('User not found');
    }

    const comment = await this.prisma.commentOnProffessor.findUnique({
      where: { id: idCommentProf },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const updatedComment = await this.prisma.commentOnProffessor.update({
      where: { id: idCommentProf },
      data: { verified: true },
    });

    const response = await axios.patch(`http://localhost:3000/prof/verifyComment/${idUser}/${comment.professorId}`, 
      {rating: comment.rating,
      });
    
    return updatedComment;
  }


  findAll() {
    return "testiranje123";
  }

  async remove(id: number) {
    const comment = await this.prisma.commentOnProffessor.findUnique({
      where: { id: id },
    });
    if (!comment) {
      throw new Error('Comment not found');
    }

    const oldRating = comment.rating;

    const DeletedComment = await this.prisma.commentOnProffessor.delete({
      where: { id: id },
    });

    const request = await axios.patch(`http://localhost:3000/prof/deleteComment/${comment.professorId}/${oldRating}`);

    return DeletedComment;
  }



}
