import { Module } from '@nestjs/common';
import { CommentSubjService } from './comment-subj.service';
import { CommentSubjController } from './comment-subj.controller';
import {SubjService} from "../subj/subj.service";

@Module({
  controllers: [CommentSubjController],
  providers: [CommentSubjService, SubjService],
})
export class CommentSubjModule {}
