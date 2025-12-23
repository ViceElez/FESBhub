import {Controller, Get, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { SubjService } from './subj.service';
import { UpdateSubjDto } from './dto/update-subj.dto';
import { UserGuard } from '../guards';

@UseGuards(UserGuard)
@Controller('subj')
export class SubjController {
  constructor(private readonly subjService: SubjService) {}

  @Get(':id')
    async getSubjById(@Param('id') id: string) {
        return this.subjService.getSubjById(id);
    }

  @Get()
  async findFirst24(){
      return this.subjService.findFirst24();
  }

}
