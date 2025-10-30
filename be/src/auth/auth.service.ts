import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto,LoginDto} from "./dtos";
import * as argon from 'argon2'
import {JwtService} from "@nestjs/jwt";
import {v4 as uuid} from 'uuid';
import {createTransport} from "nodemailer";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,private jwtService:JwtService
    ) {}


    async register(dto:RegisterDto){
        const existingUser=await this.prisma.user.findFirst({
            where:{
                email:dto.email
            }
        });
        if(existingUser){
            throw new BadRequestException('User already exists');
        }

        const passwordForHashing=await this.pepperPassword(dto.password)
        const hashedPassword=await argon.hash(passwordForHashing);

        const newUser=await this.prisma.user.create({
            data:{
                email:dto.email,
                password:hashedPassword,
                firstName:dto.firstName,
                lastName:dto.lastName,
                studij:dto.studij,
                currentStudyYear:dto.currentStudyYear
            }
        });
        const {accessToken,refreshToken}=await this.generateUserToken(newUser.id);
        await this.sendVerificationEmail(newUser.id,newUser.email,newUser.firstName);

        return {
            accessToken,
            email:newUser.email
        }
    }

    async login(dto:LoginDto){
        const loggedUser=await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        });
        if(!loggedUser){
            throw new UnauthorizedException('Invalid credentials');
        }

        if(!loggedUser.isEmailVerified){
            throw new BadRequestException('Please verify your email before logging in');
        }

        const passwordForVerification=await this.pepperPassword(dto.password);
        const isPasswordValid=await argon.verify(loggedUser.password,passwordForVerification);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials');
        }

        const {accessToken,refreshToken}=await this.generateUserToken(loggedUser.id);

        return accessToken
    }

    async logout(loggedOutUserId: number){
        await this.revokeActiveRefreshTokens(loggedOutUserId);
        return { message: "User logged out successfully",loggedOutUserId };
    }

    async generateUserToken(userId:number){
        await this.revokeActiveRefreshTokens(userId);

        const payload={sub:userId};
        const accessToken=await this.jwtService.signAsync(payload,{
            expiresIn:'15m'
        });

        const refreshToken=uuid();
        await this.storeRefreshToken(userId,refreshToken);

        return {
            accessToken,
            refreshToken
        }
    }

    async storeRefreshToken(userId:number,refreshToken:string){
        const expirationDate=new Date();
        expirationDate.setDate(expirationDate.getDate()+7);
        await this.prisma.refreshToken.create({
            data:{
                token:refreshToken,
                userId,
                expiresAt:expirationDate
            }
        })
    }

    async revokeActiveRefreshTokens(userId: number): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                isrevoked: false,
            },
            data: {
                isrevoked: true,
            },
        });
    }

    async pepperPassword(password:string):Promise<string>{
        const crypto= await import('node:crypto');
        return crypto.createHmac('sha256', process.env.HASHING_SECRET!).update(password).digest('hex')
    }

    async sendVerificationEmail(userId:number,userEmail:string,userFirstName:string){
        const {transporter,verificationToken}=await this.createVerificationEmail(userId);
        try{
            await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:userEmail,
                subject:"Please verify your email",
                html:`<h1>Hello, ${userFirstName}!</h1>
                   <p>Thank you for registering. Please verify your email by clicking the link below:</p>
                   <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&id=${userId}">Verify Email</a>
                   <p>This link will expire in 10 minutes.</p>`
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

        const verificationToken=uuid();
        const verificationTokenForHashing=await this.pepperPassword(verificationToken);
        const hashedVerificationToken=await argon.hash(verificationTokenForHashing);

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

}
