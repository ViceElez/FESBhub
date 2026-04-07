import { IsNotEmpty, Min, Max, IsNumber } from 'class-validator';

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
