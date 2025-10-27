import { Injectable } from '@nestjs/common';
import { CreateCommentProfDto } from './dto/create-comment-prof.dto';
import { UpdateCommentProfDto } from './dto/update-comment-prof.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentProfService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentProfDto: CreateCommentProfDto) {
    return await this.prisma.commentOnProffessor.create({
      data: createCommentProfDto as Prisma.CommentOnProffessorCreateInput,
    });
  }
  }

  findAll() {
    return `This action returns all commentProf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentProf`;
  }

  update(id: number, updateCommentProfDto: UpdateCommentProfDto) {
    return `This action updates a #${id} commentProf`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentProf`;
  }
}
