import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

import { UserGuard, AdminGuard } from '../guards';

@Controller('posts')
export class PostsController{
    constructor(private readonly postsService:PostsService){}

    @Get()
    async getAll(){
        return this.postsService.findAll();
    }

    // Only authenticated admins may create posts
    @UseGuards(UserGuard,AdminGuard)
    @Post()
    async create(@Body() dto:CreatePostDto,@Request() req){
        const userId = req.user?.sub;
        return this.postsService.create(dto,userId);
    }
}
