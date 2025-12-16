import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { AdminGuard, UserGuard } from '../guards';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    async getAll() {
        return this.postsService.findAll();
    }

    // Authenticated users can create posts (admins auto-verify)
    @UseGuards(UserGuard)
    @Post()
    async create(@Body() dto: CreatePostDto, @Request() req) {
        const userId = Number(req.user?.sub);
        const isAdmin = Boolean(req.user?.isAdmin);
        return this.postsService.create(dto, userId, isAdmin);
    }

    // Admin-only delete
    @UseGuards(UserGuard, AdminGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const deleted = await this.postsService.remove(id);
        if (!deleted) throw new NotFoundException('Post not found');
        return deleted;
    }

    // Admin-only update
    @UseGuards(UserGuard, AdminGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
        const updated = await this.postsService.update(id, dto);
        if (!updated) throw new NotFoundException('Post not found');
        return updated;
    }

    // Get current user's posts
    @UseGuards(UserGuard)
    @Get('me')
    async getMine(@Request() req) {
        const userId = Number(req.user?.sub);
        return this.postsService.findMine(userId);
    }

    // Delete one of current user's posts (admins can delete any)
    @UseGuards(UserGuard)
    @Delete('me/:id')
    async removeMine(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userId = Number(req.user?.sub);
        const isAdmin = Boolean(req.user?.isAdmin);

        const deleted = await this.postsService.removeMine(id, userId, isAdmin);
        if (!deleted) throw new NotFoundException('Post not found');
        return deleted;
    }
}
    // admin-only: verify a post (set verified=true)
    @UseGuards(UserGuard, AdminGuard)
    @Patch(':id/verify')
    async verify(@Param('id', ParseIntPipe) id: number) {
        const updated = await this.postsService.approve(id);
        if (!updated) {
            throw new NotFoundException('Post not found');
        }
        return updated;
    }

}
