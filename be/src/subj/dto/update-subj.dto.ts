import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjDto } from './create-subj.dto';

export class UpdateSubjDto extends PartialType(CreateSubjDto) {}
