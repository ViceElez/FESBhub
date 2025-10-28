import { IsString, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateCommentProfDto {
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
    professorId: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
}
