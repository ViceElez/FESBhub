import { IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class UpdatePostDto {
    title?: string;
    content?: string;
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[]; // array of image URLs or base64 data
}
//triba ogranicit photo