import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Patch, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
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

    // Admin-only brisanje za postove
    @UseGuards(UserGuard, AdminGuard) 
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id:number){
        const deleted = await this.postsService.remove(id);
        if(!deleted){
            // ovo se moze prominit da izbacuje neki error 
            // ili nes drugo
            throw new NotFoundException('Post not found'); 

        }
        return deleted;
    }
    //admin only editanje postova
   @UseGuards(UserGuard, AdminGuard)
    @Patch(':id')
    async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    ) {
    try {
        return await this.postsService.update(id, dto);
    } catch (e) {
        // ako se nenade baca ti NotFoundException
        throw new NotFoundException('Post not found');
    }
    }

}
