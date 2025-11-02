import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import * as argon from "argon2";
import {createTransport} from "nodemailer";

@Injectable()
export class EmailService {
    constructor(
        private readonly prisma:PrismaService,private jwtService:JwtService
    ) {}

    async sendVerificationEmail(userId:number,userEmail:string,userFirstName:string){
        const {transporter,verificationToken}=await this.createVerificationEmail(userId);
        try{
            await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:userEmail,
                subject:"Please verify your email",
                html:`<h1>Hello, ${userFirstName}!</h1>
                   <p>Thank you for registering. Please verify your email by typing this code:${verificationToken}</p>
                   <p>This code will expire in 10 minutes.</p>`
            })
        }catch (error){
                        console.error("Error sending verification email:",error);
            throw error;
        }
    }

    async createVerificationEmail(userId:number){
        const transporter=createTransport({
            host:process.env.EMAIL_HOST,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })

        const randomInt=require('crypto')
        const verificationToken=randomInt.randomInt(100000,999999).toString();
        const hashedVerificationToken=await argon.hash(verificationToken);

        const expirationDate=new Date();
                expirationDate.setMinutes(expirationDate.getMinutes() + 10);

        await this.prisma.emailVerificationToken.create({
            data:{
                token:hashedVerificationToken,
                userId,
                expiresAt:expirationDate
            }
        });

        return {transporter,verificationToken};
    }

    async verifyEmail(userId:number,code:string){
        const verificationTokenRecord=await this.prisma.emailVerificationToken.findFirst({
            orderBy:{
                createdAt:'desc'
            },
            where:{
                userId,
            }
        })
        if(!verificationTokenRecord){
            throw new Error('Invalid or expired verification code');
        }

        if(verificationTokenRecord.expiresAt<=new Date()){
            throw new Error('Verification code has expired');
        }

        const isCodeValid=await argon.verify(verificationTokenRecord.token,code);

        if(!isCodeValid){
            throw new UnauthorizedException('Invalid verification code❌');
        }

        await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                isEmailVerified:true
            }
        });

        await this.prisma.emailVerificationToken.deleteMany({
            where:{
                userId
            }
        });
       return {message:'✅ Email verified successfully!'};
    }

    async resendVerificationEmail(userId:number){
        const   user=await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        });
        if(!user){
            throw new Error('User not found');
        }
        await this.prisma.emailVerificationToken.deleteMany({
            where:{
                userId
            }
        });

        await this.sendVerificationEmail(user.id,user.email,user.firstName)
    }
}

//nesmi se u local storage spramat jwt
//ne zaborvi vratit da mail mora bit @fesb u dto i fe registerApi.ts
//protect fe route
//nesto oko toga da se transprter ne pravi svaki put iznova nego da se nesto reusa

