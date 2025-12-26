import {Controller, Get, UseGuards} from '@nestjs/common';
import { ProfService } from './prof.service';
import {UserGuard} from "../guards";

@UseGuards(UserGuard)
@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}


  @UseGuards(UserGuard)
  @Get()
  findAll(){
    return this.profService.findAll();
  }

}


