import { Module } from '@nestjs/common';
import { CommentSubjService } from './comment-subj.service';
import { CommentSubjController } from './comment-subj.controller';

@Module({
  controllers: [CommentSubjController],
  providers: [CommentSubjService],
})
export class CommentSubjModule {}
