import {IsNumber, IsEmail, IsNotEmpty, IsString, Max, Min} from 'class-validator';

export class CreateProfDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    specialization: string;

    @IsString()
    @IsNotEmpty()
    education: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
