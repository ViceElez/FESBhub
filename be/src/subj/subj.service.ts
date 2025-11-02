import { Injectable } from '@nestjs/common';
import { CreateSubjDto } from './dto/create-subj.dto';
import { UpdateSubjDto } from './dto/update-subj.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjService {
  constructor(private prisma: PrismaService) {}

  async updateAfterAdminVerification(idUser: number, idSubj: number, updateSubjDto: UpdateSubjDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: idUser },
      select: { isAdmin: true },
    });

    if(!user){
      throw new Error('User not found or not admin');
    }

    const subj = await this.prisma.subject.findUnique({
      where: { id: idSubj },
    });

    if(!subj){
      throw new Error('Subject not found');
    }

    const { ratingExpectation, ratingDifficulty, ratingPracticality } = updateSubjDto;
    if (ratingExpectation === undefined || 
      ratingDifficulty === undefined || 
      ratingPracticality === undefined ||
      ratingExpectation === null || 
      ratingDifficulty === null || 
      ratingPracticality === null) {
      throw new Error('All ratings are required');
    }

    const numberOfVerifiedComments = await this.prisma.commentOnSubject.count({
        where: { subjectId: idSubj, verified: true }
    });

    if(numberOfVerifiedComments === 0){
      return this.prisma.subject.update({
        where: { id: idSubj },
        data: {
          ratingExpectations: 0,
          ratingPracticality: 0,
          ratingDifficulty: 0,
        },
      });
    }

    return this.prisma.subject.update({
      where: { id: idSubj },
      data: {
        ratingExpectations: ((subj.ratingExpectations * (numberOfVerifiedComments - 1)) + subj.ratingExpectations) / numberOfVerifiedComments,
        ratingDifficulty: ((subj.ratingDifficulty * (numberOfVerifiedComments - 1)) + subj.ratingDifficulty) / numberOfVerifiedComments,
        ratingPracticality: ((subj.ratingPracticality * (numberOfVerifiedComments - 1)) + subj.ratingPracticality) / numberOfVerifiedComments,
      },
      });
  }

  async updateAfterCommentDeletion(idSubj: number, oldRatingExpectations: number, oldRatingDifficulty: number, oldRatingPracticality: number) {
    const subj = await this.prisma.subject.findUnique({
      where: {
        id: idSubj
      },
    });

    if(!subj){
      throw new Error("Subject not found");
    }

    const numberOfVerifiedComments = await this.prisma.commentOnSubject.count(
      {where: {
      subjectId: idSubj,
      verified: true
      },
    });

    if(numberOfVerifiedComments === 0){
      return this.prisma.subject.update({
        where: { id: idSubj },
        data: {
          ratingExpectations: 0,
          ratingPracticality: 0,
          ratingDifficulty: 0,
        },
      });
    }

    return this.prisma.subject.update({
      where: { id: idSubj },
      data: {
        ratingExpectations: ((subj.ratingExpectations * (numberOfVerifiedComments - 1)) + subj.ratingExpectations) / numberOfVerifiedComments,
        ratingDifficulty: ((subj.ratingDifficulty * (numberOfVerifiedComments - 1)) + subj.ratingDifficulty) / numberOfVerifiedComments,
        ratingPracticality: ((subj.ratingPracticality * (numberOfVerifiedComments - 1)) + subj.ratingPracticality) / numberOfVerifiedComments,
      },
    });
  }

}
