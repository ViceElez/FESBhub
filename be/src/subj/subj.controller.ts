import {Controller, Get, Param, UseGuards,Delete,Query} from '@nestjs/common';
import { SubjService } from './subj.service';
import { UserGuard } from '../guards';

@UseGuards(UserGuard)
@Controller('subj')
export class SubjController {
  constructor(private readonly subjService: SubjService) {}

    @Get('search')
    async getSubjByName(@Query('q') subjName: string) {
        return this.subjService.getSubjByName(subjName);
    }

  @Get()
  async findAll(){
      return this.subjService.findAll();
  }

  @Delete(':id')
    async deleteSubjById(@Param('id') id: string) {
      return this.subjService.deleteSubjById(id);
  }

    @Get(':id')
    async getSubjById(@Param('id') id: string) {
        console.log('hita sa id')
        return this.subjService.getSubjById(id);
    }
}
