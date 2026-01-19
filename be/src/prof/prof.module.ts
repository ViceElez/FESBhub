import { Module } from '@nestjs/common';
import { ProfService } from './prof.service';
import { ProfController } from './prof.controller';

@Module({
  controllers: [ProfController],
  providers: [ProfService],
})
export class ProfModule {}
