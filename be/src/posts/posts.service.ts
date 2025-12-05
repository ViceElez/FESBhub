import { BadRequestException, Injectable } from '@nestjs/common';
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
//make sure to  limit the number of posts by 10 
    async findAll(){
        return this.prisma.post.findMany({
            orderBy:{createdAt:'desc'},
            include:{user:{select:{id:true,firstName:true,lastName:true}}}
        })
    }
    
    async remove(id:number){
        // provjera postoji li
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        return this.prisma.post.delete({ where: { id } });
    }
    async update(id:number, dto: Partial<{ title:string; content:string }>) {
        // provjera postoji li
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
       
        const data: any = {};
        if (dto.title !== undefined) {
            // defensive: reject empty or whitespace-only titles
            if (typeof dto.title === 'string' && dto.title.trim() === '') {
                throw new BadRequestException('Title cannot be empty');
            }
            data.title = dto.title;
        }
        if (dto.content !== undefined) {
            if (typeof dto.content === 'string' && dto.content.trim() === '') {
                throw new BadRequestException('Content cannot be empty');
            }
            data.content = dto.content;
        }

        if (Object.keys(data).length === 0) {
            throw new BadRequestException('No fields provided for update');
        }

        const updated = await this.prisma.post.update({
            where: { id },
            data,
        });
        return updated;
    }
}
