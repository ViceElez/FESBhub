import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto,LoginDto} from "./dtos";
import * as argon from 'argon2'
import {JwtService} from "@nestjs/jwt";
import {v4 as uuid} from 'uuid';
import {EmailService} from "../email/email.service";
import type {Response} from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,private jwtService:JwtService,
        private emailService:EmailService
    ) {}


    async register(dto:RegisterDto,response:Response){
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

        await this.generateAccessToken(newUser.id)
        const refreshToken=await this.generateRefreshToken(newUser.id)
        await this.emailService.sendVerificationEmail(newUser.id,newUser.email,newUser.firstName);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    async login(dto:LoginDto,response:Response){
        const loggedUser=await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        });
        if(!loggedUser){
            throw new UnauthorizedException('Invalid dadsacredentials');
        }

        const passwordForVerification=await this.pepperPassword(dto.password);
        const isPasswordValid=await argon.verify(loggedUser.password,passwordForVerification);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials');
        }

        if(!loggedUser.isEmailVerified){
            throw new BadRequestException('Please verify your email before logging in');
        }


        const accessToken=await this.generateAccessToken(loggedUser.id)
        const refreshToken=await this.generateRefreshToken(loggedUser.id)

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return accessToken
    }

    async logout(loggedOutUserId: number){
        await this.revokeActiveRefreshTokens(loggedOutUserId);
        return { message: "User logged out successfully",loggedOutUserId };
    }

    async generateRefreshToken(userId:number){
        await this.revokeActiveRefreshTokens(userId);

        const refreshToken=uuid();
        const pepperedRefreshToken=await this.pepperPassword(refreshToken);
        const hashedRefreshToken=await argon.hash(pepperedRefreshToken);
        await this.storeRefreshToken(userId,hashedRefreshToken);

        return refreshToken;
    }

    async generateAccessToken(userId:number){
        const payload={sub:userId};
        return await this.jwtService.signAsync(payload,{
            expiresIn:'1m'
        });
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

    async refreshAccessToken(oldRefreshToken:string){
        const activeStoredRefreshToken=await this.prisma.refreshToken.findFirst({
            where:{
                token:oldRefreshToken,
                isrevoked:false,
            }
        });
        if(!activeStoredRefreshToken){
            throw new UnauthorizedException('Invalid refresh token');
        }

        const pepperedRefreshToken=await this.pepperPassword(oldRefreshToken);
        const isRefreshTokenValid=await argon.verify(activeStoredRefreshToken.token,pepperedRefreshToken);
        if(!isRefreshTokenValid){
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user=await this.prisma.user.findUnique({
            where:{
                id:activeStoredRefreshToken.userId
            }
        });
        if(!user){
            throw new UnauthorizedException('User not found');
        }

        return await this.generateAccessToken(user.id);
    }

}
