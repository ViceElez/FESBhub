import { IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    content?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[]; // array of image URLs or base64 data
}
//triba ogranicit photo