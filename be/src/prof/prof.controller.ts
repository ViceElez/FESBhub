import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfService } from './prof.service';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';

@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Patch(':idUser/:idProf')
  update(@Param('idUser') idUser: string, 
  @Param('idProf') idProf: string,
  @Body() updateProfDto: UpdateProfDto) {
    return this.profService.updateAfterAdminVerification(+idUser, +idProf, updateProfDto);
  }

}
