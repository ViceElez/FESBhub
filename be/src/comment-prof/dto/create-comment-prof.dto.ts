import { IsString, IsInt, Min } from 'class-validator';

export class CreateCommentProfDto {
    @IsString()
    content: string;

    @IsInt()
    @Min(1)
    userId: number;

    @IsInt()
    @Min(1)
    professorId: number;
}
