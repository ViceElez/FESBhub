import {Controller, Delete, Get, UseGuards,Param} from '@nestjs/common';
import { ProfService } from './prof.service';
import {UserGuard} from "../guards";

@UseGuards(UserGuard)
@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Get()
  findAll(){
    return this.profService.findAll();
  }

  @Delete(':id')
    async deleteProfById(@Param('id') id: string) {
        return this.profService.deleteProfById(id);
    }



}


