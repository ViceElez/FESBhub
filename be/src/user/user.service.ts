import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getMyProfile(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                isAdmin: true,
                isVerified: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateMyProfile(userId: number, dto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
                ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
                ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                isAdmin: true,
                isVerified: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getUserById(userId: string) {
        if (!userId) throw new Error('User ID is required');
        return this.prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
    }

    async isUserAdmin(userId: string): Promise<boolean | undefined> {
        const user = await this.getUserById(userId);
        return user?.isAdmin;
    }
}