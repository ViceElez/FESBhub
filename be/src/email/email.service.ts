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

        const verificationToken=Math.floor(100000 + Math.random() * 900000).toString();
        const hashedVerificationToken=await argon.hash(verificationToken);

        const expirationDate=new Date();
        expirationDate.setHours(expirationDate.getHours()+10*60*1000);

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
        const findRegisteredUsersEmailToken=await this.prisma.emailVerificationToken.findFirst({
            orderBy:{
                createdAt:'desc'
            },
            where:{
                userId,
            }
        })
        if(!findRegisteredUsersEmailToken){
            throw new Error('Invalid or expired verification code');
        }

        console.log(findRegisteredUsersEmailToken)
        const isCodeValid=await argon.verify(findRegisteredUsersEmailToken.token,code);

        if(!isCodeValid){
            throw new UnauthorizedException('Invalid verification code❌');
        }

        if(findRegisteredUsersEmailToken.expiresAt < new Date()){
            throw new Error('Verification code has expired');
        }

        await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                isEmailVerified:true
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
//zablokirat register botiun i login da user nemoze 50 puta udrit

