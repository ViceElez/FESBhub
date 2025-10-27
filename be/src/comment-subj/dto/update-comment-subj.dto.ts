import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentSubjDto } from './create-comment-subj.dto';

export class UpdateCommentSubjDto extends PartialType(CreateCommentSubjDto) {}
