import { IsString, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class DeleteCommentSubjDto {
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    subjectId: number;
}