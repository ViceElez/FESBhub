import { Injectable } from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';

@Injectable()
export class ProfService {
  create(createProfDto: CreateProfDto) {
    
  }

  findAll() {
    return `This action returns all prof`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prof`;
  }

  update(id: number, updateProfDto: UpdateProfDto) {
    return `This action updates a #${id} prof`;
  }

  remove(id: number) {
    return `This action removes a #${id} prof`;
  }
}
