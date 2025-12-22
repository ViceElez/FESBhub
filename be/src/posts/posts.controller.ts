import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Patch, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserGuard, AdminGuard } from '../guards';

@Controller('posts')
export class PostsController{
    constructor(private readonly postsService:PostsService){}

    //@UseGuards(UserGuard)
    @Get()
    async getAll(){
        return this.postsService.findAll();
    }

    // Authenticated users may create posts (admins auto-publish, users need approval)
    @UseGuards(UserGuard)
    @Post()
    async create(@Body() dto:CreatePostDto,@Request() req){
        const userId = req.user?.sub;
        const isAdmin = Boolean(req.user?.isAdmin);
        console.log(isAdmin);
        return this.postsService.create(dto,userId,isAdmin);
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
