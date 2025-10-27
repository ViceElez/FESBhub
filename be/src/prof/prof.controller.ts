import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfService } from './prof.service';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-prof.dto';

@Controller('prof')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Post()
  create(@Body() createProfDto: CreateProfDto) {
    return this.profService.create(createProfDto);
  }

  @Get()
  findAll() {
    return this.profService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfDto: UpdateProfDto) {
    return this.profService.update(+id, updateProfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profService.remove(+id);
  }
}
