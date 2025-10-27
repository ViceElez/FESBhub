import { Module } from '@nestjs/common';
import { SubjService } from './subj.service';
import { SubjController } from './subj.controller';

@Module({
  controllers: [SubjController],
  providers: [SubjService],
})
export class SubjModule {}
