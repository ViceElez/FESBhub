import {IsEmail, IsString, MinLength, Matches, IsOptional, Min, Max, IsInt} from "class-validator";
import {Type} from "class-transformer";

export class RegisterDto{
    @IsEmail()
    //@Matches(/fesb.hr/, { message: 'Email must be a fesb.hr email address' })
    email:string;

    @IsString()
    @MinLength(6)
    password:string;

    @IsString()
    firstName:string;

    @IsOptional()
    @IsString()
    lastName?:string;

    @IsOptional()
    @IsString()
    studij?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    currentStudyYear?: number;

}