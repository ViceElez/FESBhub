import { Body, Injectable } from '@nestjs/common';
import { CreateCommentSubjDto } from './dto/create-comment-subj.dto';
import { UpdateCommentSubjDto } from './dto/update-comment-subj.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class CommentSubjService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createCommentSubjDto: CreateCommentSubjDto) {
    const NumberOfCommentsOnSubject = await this.prisma.commentOnSubject.count({
      where: {
        subjectId: createCommentSubjDto.subjectId,
        userId: createCommentSubjDto.userId,
      },
    });

    if(NumberOfCommentsOnSubject > 1){
      throw new Error('User has already commented on this subject');
    }

    const { content, userId, subjectId, ratingExpectation, ratingDifficulty, ratingPracticality } = createCommentSubjDto;

    return this.prisma.commentOnSubject.create({
      data: {
        content,
        userId,
        subjectId,
        ratingDiffuculty: ratingDifficulty,
        ratingExceptions: ratingExpectation,
        ratingPracicality: ratingPracticality,
      },
    });
  }


  async updateAfterVerification(idUser: number, idCommentSubj: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: idUser,
              isAdmin: true}
    });

    if(!user){
      throw new Error('User not found or is not admin');
    }

    const comment = await this.prisma.commentOnSubject.findUnique({
      where: { id: idCommentSubj },
    });

    if(!comment){
      throw new Error('Comment not found');
    }

    const updatedComment = await this.prisma.commentOnSubject.update({
      where: { id: idCommentSubj },
      data: { verified: true },
    });

    const request = await axios.patch(`http://localhost:3000/subj/verifyComment/${idUser}/${comment.subjectId}`,
      {ratingDiffuculty: comment.ratingDiffuculty,
       ratingExceptions: comment.ratingExceptions,
       ratingPracicality: comment.ratingPracicality,
      });

    return updatedComment
  }

  async remove(id: number) {
    const comment = await this.prisma.commentOnSubject.findUnique({
      where: {
        id: id,
      }
    });

    if(!comment){
      throw new Error("Comment not found");
    }

    const oldRatingException = comment.ratingExceptions;
    const oldRatingDiffuculty = comment.ratingDiffuculty;
    const oldRatingPracicality = comment.ratingPracicality;

    const deletedComment = await this.prisma.commentOnSubject.delete(
      {where: {
        id: id
      }});

    const request = await axios.patch(`http://localhost:3000/subj/deleteComment/${comment.subjectId}/${oldRatingException}/${oldRatingDiffuculty}/${oldRatingPracicality}`);

    return deletedComment;
  }
}
