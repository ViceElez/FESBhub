import { Injectable } from '@nestjs/common';
import { CreateCommentSubjDto } from './dto/create-comment-subj.dto';
import { UpdateCommentSubjDto } from './dto/update-comment-subj.dto';

@Injectable()
export class CommentSubjService {
  create(createCommentSubjDto: CreateCommentSubjDto) {
    return 'This action adds a new commentSubj';
  }

  findAll() {
    return `This action returns all commentSubj`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentSubj`;
  }

  update(id: number, updateCommentSubjDto: UpdateCommentSubjDto) {
    return `This action updates a #${id} commentSubj`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentSubj`;
  }
}
