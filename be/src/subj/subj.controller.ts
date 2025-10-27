import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjService } from './subj.service';
import { CreateSubjDto } from './dto/create-subj.dto';
import { UpdateSubjDto } from './dto/update-subj.dto';

@Controller('subj')
export class SubjController {
  constructor(private readonly subjService: SubjService) {}

  @Post()
  create(@Body() createSubjDto: CreateSubjDto) {
    return this.subjService.create(createSubjDto);
  }

  @Get()
  findAll() {
    return this.subjService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjDto: UpdateSubjDto) {
    return this.subjService.update(+id, updateSubjDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjService.remove(+id);
  }
}
