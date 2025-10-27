import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentProfDto } from './create-comment-prof.dto';

export class UpdateCommentProfDto extends PartialType(CreateCommentProfDto) {}
