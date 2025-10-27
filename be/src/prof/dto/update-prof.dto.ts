import { PartialType } from '@nestjs/mapped-types';
import { CreateProfDto } from './create-prof.dto';

export class UpdateProfDto extends PartialType(CreateProfDto) {}
