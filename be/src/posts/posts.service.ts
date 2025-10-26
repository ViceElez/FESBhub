import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService{
    constructor(private readonly prisma:PrismaService){}

    async create(dto:CreatePostDto,userId:number){
        const post=await this.prisma.post.create({
            data:{
                title:dto.title,
                content:dto.content,
                userId,
                // admin-created posts are verified by default
                verified:true
            }
        });
        return post;
    }

    async findAll(){
        return this.prisma.post.findMany({
            orderBy:{createdAt:'desc'},
            include:{user:{select:{id:true,firstName:true,lastName:true}}}
        })
    }
}
