import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto,LoginDto} from "./dtos";
import * as argon from 'argon2'
import {JwtService} from "@nestjs/jwt";
import {v4 as uuid} from 'uuid';
import {jwtDecode} from "jwt-decode";

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

    async logout(loggedOutUserId: number){
        await this.prisma.refreshToken.updateMany({
            where:{
                userId:loggedOutUserId,
                isrevoked:false
            },
            data:{
                isrevoked:true
            }
        });

        return { message: "User logged out successfully",loggedOutUserId };
    }

    async generateUserToken(userId:number,email:string,isRefreshed:boolean,oldTokenString?:string){

        if(isRefreshed&&oldTokenString !== undefined){
            await this.prisma.refreshToken.update({
                where:{
                    token:oldTokenString
                },
                data:{
                    isrevoked:true
                }
            });
        }

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
}
