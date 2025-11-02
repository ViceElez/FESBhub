import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjDto } from './create-subj.dto';
import { IsNotEmpty } from 'class-validator/types/decorator/common/IsNotEmpty';
import { Min } from 'class-validator/types/decorator/number/Min';
import { Max } from 'class-validator/types/decorator/number/Max';
import { IsNumber } from 'class-validator/types/decorator/typechecker/IsNumber';

export class UpdateSubjDto{
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingExpectation: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingDifficulty: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    ratingPracticality: number;
}
