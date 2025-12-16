import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

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

    async remove(id: number) {
        // Check if post exists
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        return this.prisma.post.delete({ where: { id } });
    }

    async update(id: number, dto: Partial<{ title: string; content: string }>) {
        // Check if post exists
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

    // Fetch posts created by the current user
    async findMine(userId: number) {
        return this.prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
        });
    }

    // Delete a post if it belongs to the user, or allow admins to delete any post
    async removeMine(postId: number, userId: number, isAdmin: boolean) {
        const existing = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!existing) return null;

        if (existing.userId !== userId && !isAdmin) {
            throw new ForbiddenException('Not allowed to delete this post');
        }

        return this.prisma.post.delete({ where: { id: postId } });
    }
}
    async approve(id: number) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing) return null;
        const updated = await this.prisma.post.update({
            where: { id },
            data: { verified: true },
        });
        return updated;
    }
}
