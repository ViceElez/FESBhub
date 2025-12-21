import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfService } from './prof.service';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';
import { patch } from 'axios';
import { UserGuard, AdminGuard } from '../guards';

@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}


  @UseGuards(UserGuard)
  @Get()
  findFirst24(){
    return this.profService.findFirst24();
  }

}


