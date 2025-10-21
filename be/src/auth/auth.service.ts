import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto} from "./dtos";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private readonly prisma:PrismaService) {}

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
}
