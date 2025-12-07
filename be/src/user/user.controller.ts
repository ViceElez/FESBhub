import { Controller,Get,Req,UseGuards,Param } from '@nestjs/common';
import { UserGuard } from '../guards';
import { UserService } from './user.service';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly UserService: UserService,
    ) {}

    @Get('allUsers')
    async getAllUsers(@Req() req) {
        return { message: 'This action returns all users', user: req.user };
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.UserService.getUserById(id);
    }

    @Get('isAdmin/:id')
    async isUserAdmin(@Param('id') id: string) {
        const isAdmin=await this.UserService.isUserAdmin(id);
        return {isAdmin};
    }
}
