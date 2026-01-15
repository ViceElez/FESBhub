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
        const q = query?.trim();
        if (!q) return [];

        return this.prisma.post.findMany({
            where: {
                verified: true,
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { content: { contains: q, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: { photos: true, user: { select: { id: true, firstName: true, lastName: true } } },
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

    async updateMine(postId: number, userId: number, isAdmin: boolean, dto: Partial<{ title: string; content: string; photos: string[] }>) {
        const existing = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!existing) return null;
        // Only allow user to update their own posts
        if (existing.userId !== userId) return null;

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
            // Delete existing photos and create new ones
            data.photos = {
                deleteMany: {},
                create: dto.photos.map(url => ({ url })),
            };
        }

        if (Object.keys(data).length === 0) {
            throw new BadRequestException('No fields provided for update');
        }

        // Set verified to false for non-admin users when they edit
        if (!isAdmin) {
            data.verified = false;
        }

        return this.prisma.post.update({
            where: { id: postId },
            data,
            include: { photos: true, user: { select: { id: true, firstName: true, lastName: true } } },
        });
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
            // Delete existing photos and create new ones
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
}
