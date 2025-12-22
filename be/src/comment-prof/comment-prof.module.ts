import { Module } from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CommentProfController } from './comment-prof.controller';
import { ProfService } from 'src/prof/prof.service';

@Module({
  controllers: [CommentProfController],
  providers: [CommentProfService, ProfService],
})
export class CommentProfModule {}
