import { Injectable } from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfService {
  constructor(private prisma: PrismaService) {}

  async updateAfterAdminVerification(idAdmin: number, idProf: number, updateProfDto: UpdateProfDto) {
    const admin = await this.prisma.user.findUnique({
      where: { id: idAdmin },
      select: { isAdmin: true },
    });

    if (!admin) {
      throw new Error('User not found or not admin');
    }

    const prof = await this.prisma.professor.findUnique({
      where: { id: idProf },
    });

    if (!prof) {
      throw new Error('Professor not found');
    }

    const { rating } = updateProfDto;
    if (rating === undefined || rating === null) {
      throw new Error('Rating is required');
    }
    
    const numberOfVerifiedComments = await this.prisma.commentOnProffessor.count({
        where: { professorId: idProf, verified: true }
    });

    return this.prisma.professor.update({
      where: { id: idProf },
      data: { rating: ((prof.rating * (numberOfVerifiedComments - 1)) + rating) / numberOfVerifiedComments },
      });
  }

  async updateAfterCommentDeletion(idProf: number, oldRating: number) {
    const prof = await this.prisma.professor.findUnique({
      where: { id: idProf },
    });

    if (!prof) {
      throw new Error('Professor not found');
    }

    const numberOfVerifiedComments = await this.prisma.commentOnProffessor.count({
        where: { professorId: idProf, verified: true }
    });

    if (numberOfVerifiedComments === 0) {
      return this.prisma.professor.update({
        where: { id: idProf },
        data: { rating: 0 },
      });
    }

    return this.prisma.professor.update({
      where: { id: idProf },
      data: { rating: ((prof.rating * (numberOfVerifiedComments + 1)) - oldRating) / numberOfVerifiedComments },
      });
  }

  async updateTest(id: number) {
    return await this.prisma.professor.update({
      where: { id: id },
      data: { rating: 0 },
      });
  }


}
