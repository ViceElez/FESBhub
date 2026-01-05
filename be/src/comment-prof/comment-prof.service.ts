import {Body, Injectable} from '@nestjs/common';
import {CreateCommentProfDto} from './dto/create-comment-prof.dto';
import {DeleteCommentProfDto} from './dto/delete-comment-prof.dto';
import {UpdateCommentProfDto} from './dto/update-comment-prof.dto';
import {PrismaService} from '../prisma/prisma.service';
import { ProfService } from 'src/prof/prof.service';

@Injectable()
export class CommentProfService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profService: ProfService
  ) {}

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

  async updateComment(@Body() updateCommentProfDto: UpdateCommentProfDto) {
    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: {
          professorId: updateCommentProfDto.professorId,
          userId: updateCommentProfDto.userId},
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    updateCommentProfDto.oldRating = comment.rating;
    updateCommentProfDto.oldContent = comment.content;
    const updatedComment = await this.prisma.commentOnProffessor.updateMany({
      where: {
          professorId: updateCommentProfDto.professorId,
          userId: updateCommentProfDto.userId
      },
      data: {
          rating: updateCommentProfDto.newRating,
          content: updateCommentProfDto.newContent
      },
    });

    await this.profService.updateNormal(
      updateCommentProfDto.professorId,
      updateCommentProfDto.oldRating,
      updateCommentProfDto.newRating);

    return updatedComment;
  }

  async updateVerification(@Body() updateCommentProfDto: CreateCommentProfDto) {

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

    const change = await this.profService.updateAfterAdminVerification(
      updateCommentProfDto.userId,
      updateCommentProfDto.professorId,
      { rating: comment.rating,
      }
    );
    
    return updatedComment;
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

    const change = this.profService.updateAfterCommentDeletion(
      deleteCommentProfDto.professorId,
      oldRating
    );

    return DeletedComment;
  }

  async Exists(professorId: number, userId: number): Promise<boolean> {
    const findUniqueDto: DeleteCommentProfDto = {
      professorId: professorId,
      userId: userId
    };
    const comment = await this.prisma.commentOnProffessor.findFirst({
      where: { professorId: findUniqueDto.professorId,
               userId: findUniqueDto.userId},
    });
    return (comment !== null);
  }

  async findUnverified() {
      return this.prisma.commentOnProffessor.findMany({
          where: {verified: false},
      });
  }

  async findVerified(profId: number) {
    return this.prisma.commentOnProffessor.findMany({
        where: {
          professorId: profId,
          verified: true
        },
    });
  }

  async findAllVerified() {
    return this.prisma.commentOnProffessor.findMany({
        where: {verified: true},
    });
  }

  async getCommentsByUserId(id: string) {
      const userExists = await this.prisma.user.findUnique({
          where: { id: parseInt(id) },
      });
      if (!userExists) {
          throw new Error('User not found');
      }
        return this.prisma.commentOnProffessor.findMany({
        where: { userId: parseInt(id) },
            select:{
                id:true,
                content:true,
                rating:true,
                verified:true,
                createdAt:true,
                professor:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                }
            }
        })
  }
}


