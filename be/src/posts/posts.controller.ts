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
    Query,
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

    @Get('search')
    async search(@Query('q') q?: string) {
        return this.postsService.search(q || '');
    }

  
    @UseGuards(UserGuard)
    @Get('me')
    async getMine(@Request() req) {
        const userId = Number(req.user?.sub);
        return this.postsService.findMine(userId);
    }

  
    @UseGuards(UserGuard)
    @Post()
    async create(@Body() dto: CreatePostDto, @Request() req) {
        const userId = Number(req.user?.sub);
        const isAdmin = Boolean(req.user?.isAdmin);
        return this.postsService.create(dto, userId, isAdmin);
    }

    @UseGuards(UserGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const deleted = await this.postsService.remove(id);
        if (!deleted) throw new NotFoundException('Post not found');
        return deleted;
    }

    

   @UseGuards(UserGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
        const updated = await this.postsService.update(id, dto);
        if (!updated) throw new NotFoundException('Post not found');
        return updated;
    }

   
    
    
    @UseGuards(UserGuard, AdminGuard)
    @Patch(':id/verify')
    async verify(@Param('id', ParseIntPipe) id: number) {
        const updated = await this.postsService.approve(id);
        if (!updated) {
            throw new NotFoundException('Post not found');
        }
        return updated;
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
