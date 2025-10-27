import { Injectable } from '@nestjs/common';
import { CreateSubjDto } from './dto/create-subj.dto';
import { UpdateSubjDto } from './dto/update-subj.dto';

@Injectable()
export class SubjService {
  create(createSubjDto: CreateSubjDto) {
    return 'This action adds a new subj';
  }

  findAll() {
    return `This action returns all subj`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subj`;
  }

  update(id: number, updateSubjDto: UpdateSubjDto) {
    return `This action updates a #${id} subj`;
  }

  remove(id: number) {
    return `This action removes a #${id} subj`;
  }
}
