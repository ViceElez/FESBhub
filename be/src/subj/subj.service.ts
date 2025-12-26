import { Injectable } from '@nestjs/common';
import { CreateSubjDto } from './dto/create-subj.dto';
import { UpdateSubjDto } from './dto/update-subj.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjService {
  constructor(private prisma: PrismaService) {}

  async updateNormal(
    subjId: number, 
    oldRatingExpectation: number, 
    newRatingExpectation: number,
    oldRatingDifficulty: number, 
    newRatingDifficulty: number,
    oldRatingPracticality: number, 
    newRatingPracticality: number) {

      const subj = await this.prisma.subject.findUnique({
        where: { id: subjId },
      });

      if(!subj){
        throw new Error('Subject not found');
      }

      const numberOfVerifiedComments = await this.prisma.commentOnSubject.count({
          where: { subjectId: subjId, verified: true }
      });

      return this.prisma.subject.update({
        where: { id: subjId },
        data: {
          ratingExpectations: ((subj.ratingExpectations * numberOfVerifiedComments) - oldRatingExpectation + newRatingExpectation) / numberOfVerifiedComments,
          ratingDifficulty: ((subj.ratingDifficulty * numberOfVerifiedComments) - oldRatingDifficulty + newRatingDifficulty) / numberOfVerifiedComments,
          ratingPracticality: ((subj.ratingPracticality * numberOfVerifiedComments) - oldRatingPracticality + newRatingPracticality) / numberOfVerifiedComments,
        },
      });
  }

  async updateAfterAdminVerification(idUser: number, idSubj: number, updateSubjDto: UpdateSubjDto) {

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
        ratingExpectations: ((subj.ratingExpectations * (numberOfVerifiedComments - 1)) + updateSubjDto.ratingExpectation) / numberOfVerifiedComments,
        ratingDifficulty: ((subj.ratingDifficulty * (numberOfVerifiedComments - 1)) + updateSubjDto.ratingDifficulty) / numberOfVerifiedComments,
        ratingPracticality: ((subj.ratingPracticality * (numberOfVerifiedComments - 1)) + updateSubjDto.ratingPracticality) / numberOfVerifiedComments,
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
        ratingExpectations: ((subj.ratingExpectations * (numberOfVerifiedComments + 1)) - oldRatingExpectations) / numberOfVerifiedComments,
        ratingDifficulty: ((subj.ratingDifficulty * (numberOfVerifiedComments + 1)) - oldRatingDifficulty) / numberOfVerifiedComments,
        ratingPracticality: ((subj.ratingPracticality * (numberOfVerifiedComments + 1)) - oldRatingPracticality) / numberOfVerifiedComments,
      },
    });
  }

  async getSubjById(id: string) {
        return this.prisma.subject.findUnique({
            where: { id: Number(id) },
        })
  }

  async findAll() {
      return this.prisma.subject.findMany();
  }
}
