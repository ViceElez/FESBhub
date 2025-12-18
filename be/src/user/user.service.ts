import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma:PrismaService,
    ) {}

    async getUserById(userId:string){
        if(!userId){
            throw new Error('User ID is required');
        }
        return this.prisma.user.findUnique({
            where:{
                id:parseInt(userId)
            }
        })
    }

    async isUserAdmin(userId:string):Promise<boolean | undefined>{
        const user=await this.getUserById(userId)
        return user?.isAdmin;
    }

    async getAllUsers(){
        return this.prisma.user.findMany();
    }
}
