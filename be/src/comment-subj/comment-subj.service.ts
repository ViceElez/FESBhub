import { Body, Injectable } from '@nestjs/common';
import { CreateCommentSubjDto } from './dto/create-comment-subj.dto';
import { UpdateCommentSubjDto } from './dto/update-comment-subj.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import { DeleteCommentSubjDto } from './dto/delete-comment-subj.dto';
import {SubjService} from "../subj/subj.service";

@Injectable()
export class CommentSubjService {
  constructor(private readonly prisma: PrismaService,
              private readonly subjService: SubjService
  ) {}

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

  async updateAfterVerification(updateCommentSubjDto: CreateCommentSubjDto) {

    const comment = await this.prisma.commentOnSubject.findFirst({
      where: { subjectId: updateCommentSubjDto.subjectId,
               userId: updateCommentSubjDto.userId},
    });

    if(!comment){
      throw new Error('Comment not found');
    }

    const updatedComment = await this.prisma.commentOnSubject.updateMany({
      where: { subjectId: updateCommentSubjDto.subjectId,
               userId: updateCommentSubjDto.userId},
      data: { verified: true },
    });

    const change = await this.subjService.updateAfterAdminVerification(
      updateCommentSubjDto.userId,
      updateCommentSubjDto.subjectId,
      {
        ratingExpectation: comment.ratingExceptions,
        ratingDifficulty: comment.ratingDiffuculty,
        ratingPracticality: comment.ratingPracicality
      }
    );

    return updatedComment
  }

  async remove(deleteCommentSubjDto: DeleteCommentSubjDto) {
    const comment = await this.prisma.commentOnSubject.findFirst({
      where: {
        subjectId: deleteCommentSubjDto.subjectId,
        userId: deleteCommentSubjDto.userId
      }
    });

    if(!comment){
      throw new Error("Comment not found");
    }

    const oldRatingException = comment.ratingExceptions;
    const oldRatingDiffuculty = comment.ratingDiffuculty;
    const oldRatingPracicality = comment.ratingPracicality;

    const deletedComment = await this.prisma.commentOnSubject.deleteMany(
      {where: {
        subjectId: deleteCommentSubjDto.subjectId,
        userId: deleteCommentSubjDto.userId
      }});

    const DeletedComment = await this.subjService.updateAfterCommentDeletion(
      deleteCommentSubjDto.subjectId,
      oldRatingException,
      oldRatingDiffuculty,
      oldRatingPracicality
    );

    return deletedComment;
  }

  async update(updateCommentSubjDto: UpdateCommentSubjDto) {
    const comment = await this.prisma.commentOnSubject.findFirst({
      where: { subjectId: updateCommentSubjDto.subjectId,
               userId: updateCommentSubjDto.userId},
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    updateCommentSubjDto.oldContent = comment.content;
    updateCommentSubjDto.oldRatingExpectation = comment.ratingExceptions;
    updateCommentSubjDto.oldRatingDifficulty = comment.ratingDiffuculty;
    updateCommentSubjDto.oldRatingPracticality = comment.ratingPracicality;
    const updatedComment = await this.prisma.commentOnSubject.updateMany({
      where: { subjectId: updateCommentSubjDto.subjectId,
               userId: updateCommentSubjDto.userId},
      data: {
        content: updateCommentSubjDto.newContent,
        ratingExceptions: updateCommentSubjDto.newRatingExpectation,
        ratingDiffuculty: updateCommentSubjDto.newRatingDifficulty,
        ratingPracicality: updateCommentSubjDto.newRatingPracticality
      },
    });

    const change = await this.subjService.updateNormal(
      updateCommentSubjDto.subjectId,
      updateCommentSubjDto.oldRatingExpectation,
      updateCommentSubjDto.newRatingExpectation,
      updateCommentSubjDto.oldRatingDifficulty,
      updateCommentSubjDto.newRatingDifficulty,
      updateCommentSubjDto.oldRatingPracticality,
      updateCommentSubjDto.newRatingPracticality
    );

    return updatedComment;

  }

  async Exists(subjectId: number, userId: number): Promise<boolean> {
    const comment = await this.prisma.commentOnSubject.findFirst({
      where: { subjectId: subjectId,
               userId: userId},
    });
    return (comment !== null);
  }

  async findUnverified() {
    return this.prisma.commentOnSubject.findMany({
      where: { verified: false },
    });
  }

  async findVerified(subjectId: number) {
    return this.prisma.commentOnSubject.findMany({
      where: { verified: true,
               subjectId: subjectId },
    });
  }

  async findAllVerified() {
    return this.prisma.commentOnSubject.findMany({
      where: { verified: true },
    });
  }
}

