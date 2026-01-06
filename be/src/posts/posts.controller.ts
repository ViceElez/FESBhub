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

    @UseGuards(UserGuard)
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

   @UseGuards(UserGuard)
    @Patch(':id')
    async update(
    @Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    try {
        return await this.postsService.update(id, dto);
    } catch (e) {
        // ako se nenade baca ti NotFoundException
        throw new NotFoundException('Post not found');
    }
    }

    @UseGuards(UserGuard)
    @Get('unverified')
    async getUnverified(){
        return this.postsService.findUnverified();
    }

    @UseGuards(UserGuard)
    @Get('verified')
    async getVerified(){
        return this.postsService.findVerified();
    }

    @UseGuards(UserGuard)
    @Get('user/:userId')
    async getPostsByUserId(@Param('userId', ParseIntPipe) userId:number){
        return this.postsService.getPostByUserId(userId);
    }

    @UseGuards(UserGuard)
    @Patch('verify/:id')
    async verifyPost(@Param('id') userId:string){
        return this.postsService.verifyPost(parseInt(userId));
    }
}
