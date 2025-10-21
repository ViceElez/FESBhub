import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto,LoginDto} from "./dtos";
import * as argon from 'argon2'
import {JwtService} from "@nestjs/jwt";

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

        const accessToken=await this.generateUserToken(loggedUser.id,loggedUser.email);

        return {accessToken};
    }

    async generateUserToken(userId:number,email:string){
        const payload={sub:userId,email};
        const accessToken=await this.jwtService.signAsync(payload,{
            expiresIn:'15m'
        });
        return accessToken;
    }
}
