import {Controller, Get, Req, UseGuards, Param, Patch, Delete} from '@nestjs/common';
import { UserGuard } from '../guards';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
@UseGuards(UserGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly UserService: UserService,
    ) {}
    @Get('allUsers')
    async getAllUsers() {
        return this.UserService.getAllUsers();
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

    @Patch('verify/:id')
    async verifyUser(@Param('id') id: string) {
        return this.UserService.verifyUser(id);
    }

    @Patch('unverify/:id')
    async unverifyUser(@Param('id') id: string) {
        return this.UserService.unverifyUser(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.UserService.deleteUser(id);
    }
     @Get('me')
    async me(@Req() req) {
        const userId = Number(req.user?.sub);
        return this.UserService.getMyProfile(userId);
    }
     @Patch('me')
    async updateMe(@Req() req,   dto: UpdateProfileDto) {
        const userId = Number(req.user?.sub);
        return this.UserService.updateMyProfile(userId, dto);
    }
}
