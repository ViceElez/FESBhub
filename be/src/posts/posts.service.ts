import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreatePostDto, userId: number, isAdmin: boolean) {
        return this.prisma.post.create({
            data: {
                title: dto.title,
                content: dto.content,
                userId,
                verified: isAdmin,
            },
        });
    }

    async findAll() {
        return this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
        });
    }
    //dovoljno razlicite ig
    async remove(id: number) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        return this.prisma.post.delete({ where: { id } });
    }

    async removeMine(postId: number, userId: number, isAdmin: boolean) {
        const existing = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!existing) return null;

        return this.prisma.post.delete({ where: { id: postId } });
    }

    async update(id: number, dto: Partial<{ title: string; content: string }>) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;

        const data: { title?: string; content?: string } = {};

        if (dto.title !== undefined) {
            if (dto.title.trim() === '') throw new BadRequestException('Title cannot be empty');
            data.title = dto.title;
        }

        if (dto.content !== undefined) {
            if (dto.content.trim() === '') throw new BadRequestException('Content cannot be empty');
            data.content = dto.content;
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
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
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
}
