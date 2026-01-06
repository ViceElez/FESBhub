import {Controller, Get, Param, UseGuards,Delete} from '@nestjs/common';
import { SubjService } from './subj.service';
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
  async findAll(){
      return this.subjService.findAll();
  }

  @Delete(':id')
    async deleteSubjById(@Param('id') id: string) {
      return this.subjService.deleteSubjById(id);
  }
}
