import { Controller,Get,Req,UseGuards,Param } from '@nestjs/common';
import { UserGuard } from '../guards';
import { UserService } from './user.service';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly UserService: UserService,
    ) {}

    @Get('unverifiedUsers')
    async getUnverifiedUsers() {
        return this.UserService.getUnverifiedUsers();
    }

    @Get('verifiedUsers')
    async getVerifiedUsers() {
        return this.UserService.getVerifiedUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.UserService.getUserById(id);
    }

    @Get('byName')
    async getUserByName(@Req() req:any) {
        const username=req.username;
        console.log('Fetching user by username:', username);
        return this.UserService.getUserByUsername(username);
    }

    @Get('isAdmin/:id')
    async isUserAdmin(@Param('id') id: string) {
        const isAdmin=await this.UserService.isUserAdmin(id);
        return {isAdmin};
    }
}
