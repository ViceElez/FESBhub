import { Module } from '@nestjs/common';
import { CommentProfService } from './comment-prof.service';
import { CommentProfController } from './comment-prof.controller';

@Module({
  controllers: [CommentProfController],
  providers: [CommentProfService],
})
export class CommentProfModule {}
