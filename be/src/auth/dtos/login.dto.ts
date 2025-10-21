import {IsEmail, IsString, Matches} from "class-validator";

export class LoginDto{
    @IsEmail()
    @Matches(/fesb.hr/, { message: 'Email must be a fesb.hr email address' })
    email:string;

    @IsString()
    password:string;

}