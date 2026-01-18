import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreatePostDto, userId: number, isAdmin: boolean, ) {
        return this.prisma.post.create({
            data: {
                title: dto.title,
                content: dto.content,
                userId,
                 verified: isAdmin,
                   photos: dto.photos && dto.photos.length > 0
                    ? {
                          create: dto.photos.map(url => ({ url })),
                      }
                    : undefined,
            },
        });
    }

    async findAll() {
        return this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: { photos: true, user: { select: { id: true, firstName: true, lastName: true } } },
        });
    }

    async search(query: string) {
            return this.prisma.post.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: { photos: true, user: { select: { id: true, firstName: true, lastName: true } } },
            });
    }   
   
    
    async remove(id: number) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        return this.prisma.post.delete({ where: { id } });
    }
    async update(id: number, dto: Partial<{ title: string; content: string; photos: string[] }>) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;

        const data: any = {};

        if (dto.title !== undefined) {
            if (dto.title.trim() === '') throw new BadRequestException('Title cannot be empty');
            data.title = dto.title;
        }

        if (dto.content !== undefined) {
            if (dto.content.trim() === '') throw new BadRequestException('Content cannot be empty');
            data.content = dto.content;
        }

        if (dto.photos !== undefined) {
          
            data.photos = {
                deleteMany: {},
                create: dto.photos.map(url => ({ url })),
            };
        }

        if (Object.keys(data).length === 0) {
            throw new BadRequestException('No fields provided for update');
        }

        return this.prisma.post.update({
            where: { id },
            data,
        });
    }

    async findMine(userId: number) {
        return this.prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { photos: true, user: { select: { id: true, firstName: true, lastName: true } } },
        });
    }

    async approve(id: number) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        return this.prisma.post.update({
            where: { id },
            data: { verified: true },
        });
    }

    async findUnverified(){
        return this.prisma.post.findMany({
            where:{verified:false},
            orderBy:{createdAt:'desc'},
            include:{photos:true,user:{select:{id:true,firstName:true,lastName:true,email:true}}}
        });
    }

    async findVerified(){
        return this.prisma.post.findMany({
            where:{verified:true},
            orderBy:{createdAt:'desc'},
            include:{photos:true,user:{select:{id:true,firstName:true,lastName:true,email:true}}}
        });
    }

    async getPostByUserId(userId:number){
        const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw new BadRequestException('User does not exist');
        }
        return this.prisma.post.findMany({
            where:{userId},
            select:{
                id:true,
                title:true,
                content:true,
                verified:true,
                createdAt:true,
                user:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                }
            },
            orderBy:{createdAt:'desc'
            }
        });
    }

    async verifyPost(id:number){
        const existing=await this.prisma.post.findUnique({where:{id}});
        if(!existing) return null;
        return this.prisma.post.update({
            where:{id},
            data:{verified:true}
        });
    }

  

   


   
}
