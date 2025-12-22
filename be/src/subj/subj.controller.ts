import {Controller, Get, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { SubjService } from './subj.service';
import { UpdateSubjDto } from './dto/update-subj.dto';
import { UserGuard } from '../guards';

@UseGuards(UserGuard)
@Controller('subj')
export class SubjController {
  constructor(private readonly subjService: SubjService) {}
  
  @Patch('verifyComment7/:idUser/:idSubj')
  NewRatingAfterVerification(@Param('idUser') idUser: string, @Param('idSubj') idSubj: string, @Body() updateSubjDto: UpdateSubjDto) {
    return this.subjService.updateAfterAdminVerification(+idUser, +idSubj, updateSubjDto);
  }

  @Patch('deleteComment/:idSubj/:oldRatingExceptions/:oldRatingDiffuculty/:oldRatingPracicality')
  NewRatingAfterDeletion(@Param('idSubj') idSubj: string, @Param('oldRatingExceptions') oldRatingExceptions: string, @Param('oldRatingDiffuculty') oldRatingDiffuculty: string, @Param('oldRatingPracicality') oldRatingPracicality: string) {
    return this.subjService.updateAfterCommentDeletion(+idSubj, +oldRatingExceptions, +oldRatingDiffuculty, +oldRatingPracicality);
  }

  @Get(':id')
    async getSubjById(@Param('id') id: string) {
        return this.subjService.getSubjById(id);
    }

    @Get()
    async findFirst24(){
        return this.subjService.findFirst24();
    }




}
