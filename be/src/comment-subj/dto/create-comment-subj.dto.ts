import { IsString, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

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
        ratingExpectation: number;

        @IsNumber()
        @Min(1)
        @Max(5)
        ratingDifficulty: number;

        @IsNumber()
        @Min(1)
        @Max(5)
        ratingPracticality: number;
}
