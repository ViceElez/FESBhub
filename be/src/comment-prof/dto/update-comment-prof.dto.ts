import { IsString, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateCommentProfDto {
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    professorId: number;

    @IsNumber()
    oldRating: number;

    @IsString()
    oldContent: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    newRating: number;

    @IsString()
    @IsNotEmpty()
    newContent: string;
}
