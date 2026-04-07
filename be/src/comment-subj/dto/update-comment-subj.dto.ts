import { IsString, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { CreateCommentSubjDto } from './create-comment-subj.dto';

export class UpdateCommentSubjDto {
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    subjectId: number;

    @IsNumber()
    oldRatingPracticality: number;

    @IsNumber()
    oldRatingDifficulty: number;

    @IsNumber()
    oldRatingExpectation: number;

    @IsString()
    oldContent: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    newRatingPracticality: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    newRatingDifficulty: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    newRatingExpectation: number;

    @IsString()
    @IsNotEmpty()
    newContent: string;

}