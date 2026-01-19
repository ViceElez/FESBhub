import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto{
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    content:string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[]; // array of image URLs or base64 data
}
//nema provjere