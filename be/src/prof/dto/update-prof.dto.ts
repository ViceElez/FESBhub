import { PartialType } from '@nestjs/mapped-types';
import { CreateProfDto } from './create-prof.dto';
import {IsInt, IsNumber, IsEmail, IsNotEmpty, IsString, Max, Min} from 'class-validator';

export class UpdateProfDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating: number; 
}
