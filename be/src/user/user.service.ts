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
            },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                studij:true,
                currentStudyYear:true,
                createdAt:true,
                isVerified:true,
                isAdmin:true,
            }
        })
    }

    async isUserAdmin(userId:string):Promise<boolean | undefined>{
        const user=await this.getUserById(userId)
        if (!user){
            throw new Error('User not found');
        }
        return user?.isAdmin;
    }

    async getUserByUsername(username:string){
        const existing=await this.prisma.user.findMany({
            where:{
                firstName:username
            },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                studij:true,
                currentStudyYear:true,
                createdAt:true,
                isVerified:true,
            }
        });
        if(!existing){
            throw new Error('User not found');
        }
        return existing;
    }

    async verifyUser(userId:string){
        return this.prisma.user.update({
            where:{
                id:parseInt(userId)
            },
            data:{
                isVerified:true
            }
        });
    }

    async unverifyUser(userId:string){
        return this.prisma.user.update({
            where:{
                id:parseInt(userId)
            },
            data:{
                isVerified:false
            }
        });
    }

    async getAllUsers(){
        return this.prisma.user.findMany({
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                studij:true,
                currentStudyYear:true,
                createdAt:true,
                isVerified:true,
            }
        });
    }

    async deleteUser(userId:string){
        const existing=await this.getUserById(userId);
        if(!existing){
            throw new Error('User not found');
        }
        return this.prisma.user.delete({
            where:{
                id:parseInt(userId)
            }
        });
    }
}
