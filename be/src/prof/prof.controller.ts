import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfService } from './prof.service';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';
import { patch } from 'axios';

@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Patch('verifyComment/:idUser/:idProf')
  NewRatingAfterVerification(@Param('idUser') idUser: string, 
  @Param('idProf') idProf: string,
  @Body() updateProfDto: UpdateProfDto) {
    return this.profService.updateAfterAdminVerification(+idUser, +idProf, updateProfDto);
  }

  @Patch('deleteComment/:idProf/:oldRating')
  NewRatingAfterDeletion(@Param('idProf') idProf: string, @Param('oldRating') oldRating: string) {
    return this.profService.updateAfterCommentDeletion(+idProf, +oldRating);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.profService.updateTest(+id);
  }

}
