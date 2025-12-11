import { Body, Injectable } from '@nestjs/common';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { DeleteCommentProfDto } from './dto/delete-comment-prof.dto';
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
          userId,
          professorId,
          rating,
          content,
        },
      });
    }
  }

  async updateComment(@Body() updateCommentProfDto: CreateCommentProfDto) {
    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: { professorId: updateCommentProfDto.professorId,
               userId: updateCommentProfDto.userId},
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    const updatedComment = await this.prisma.commentOnProffessor.updateMany({
      where: { professorId: updateCommentProfDto.professorId,
               userId: updateCommentProfDto.userId},
      data: { rating: updateCommentProfDto.rating,
              content: updateCommentProfDto.content },
    });
    return updatedComment;
  }

  async updateVerification(@Body() updateCommentProfDto: CreateCommentProfDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: updateCommentProfDto.userId,
              isAdmin: true}
    });
    if (!user) {
      throw new Error('User not found or is not admin');
    }

    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: { professorId: updateCommentProfDto.professorId,
              userId: updateCommentProfDto.userId},
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const updatedComment = await this.prisma.commentOnProffessor.updateMany({
      where: { professorId: updateCommentProfDto.professorId,
               userId: updateCommentProfDto.userId},
      data: { verified: true },
    });

    const request = await axios.patch(`http://localhost:3000/prof/verifyComment/${updateCommentProfDto.userId}/${comment.professorId}`, 
      {rating: comment.rating,
      });
    
    return updatedComment;
  }


  findAll() {
    return "testiranje123";
  }

  async remove(@Body() deleteCommentProfDto: DeleteCommentProfDto) {
    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: { professorId: deleteCommentProfDto.professorId,
               userId: deleteCommentProfDto.userId},
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const oldRating = comment.rating;

    const DeletedComment = await this.prisma.commentOnProffessor.deleteMany({
      where: { professorId: deleteCommentProfDto.professorId,
                userId: deleteCommentProfDto.userId},
    });

    const request = await axios.patch(`http://localhost:3000/prof/deleteComment/${comment.professorId}/${oldRating}`);

    return DeletedComment;
  }

  async Exists(professorId: number, userId: number): Promise<boolean> {
    console.log(professorId, userId);
    const findUniqueDto: DeleteCommentProfDto = {
      professorId: professorId,
      userId: userId
    };
    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: { professorId: findUniqueDto.professorId,
               userId: findUniqueDto.userId},
    });
    return (comment === null) ? false : true;
  }
}


