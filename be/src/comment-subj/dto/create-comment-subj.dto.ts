import { IsString, IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateCommentSubjDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    subjectId: number;

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
