import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto,LoginDto,RefreshTokenDto} from "./dtos";
import * as argon from 'argon2'
import {JwtService} from "@nestjs/jwt";
import {v4 as uuid} from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,private jwtService:JwtService
    ) {}

    async register(dto:RegisterDto){
        const existingUser=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        });
        const sss=this.prisma.commentOnProffessor
        if(existingUser){
            throw new BadRequestException('User already exists');
        }

        const passwordForHashing=dto.password+process.env.HASHING_SECRET;
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
        return ({
            id:newUser.id,
            email:newUser.email,
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            studij:newUser.studij,
            currentStudyYear:newUser.currentStudyYear

        })
    }

    async login(dto:LoginDto){
        const loggedUser=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        });
        if(!loggedUser){
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordForVerification=dto.password+process.env.HASHING_SECRET;
        const isPasswordValid=await argon.verify(loggedUser.password,passwordForVerification);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials');
        }

        const {accessToken,refreshToken}=await this.generateUserToken(loggedUser.id,loggedUser.email,false);

        return {
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken:string){
        const storedToken=await this.prisma.refreshToken.findUnique({
            where:{
                token:refreshToken,
                expiresAt:{gte:new Date()},
                isrevoked:false
            }
        });
        if(!storedToken){
            throw new UnauthorizedException('Invalid refresh token');
        }
        const findUser=await this.prisma.user.findUnique({
            where:{
                id:storedToken.userId
            }
        });
        if(!findUser){
            throw new UnauthorizedException('User not found');
        }
        return this.generateUserToken(findUser.id,findUser.email,true,refreshToken);
    }

    async generateUserToken(userId:number,email:string,isRefreshed:boolean,oldTokenString?:string){

        if(isRefreshed&&oldTokenString !== undefined){
            const oldToken= await this.prisma.refreshToken.update({
                where:{
                    token:oldTokenString
                },
                data:{
                    isrevoked:true
                }
            })
        }

        const payload={sub:userId,email};
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
}
