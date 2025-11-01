import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Title cannot be empty' })
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Content cannot be empty' })
    content?: string;
}

// Note: ValidationPipe must be enabled (it is in main.ts). The decorators above prevent empty strings.
