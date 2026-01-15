import { Body, Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { UserGuard } from '../guards';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    async me(@Req() req) {
        const userId = Number(req.user?.sub);
        return this.userService.getMyProfile(userId);
    }

    @Patch('me')
    async updateMe(@Req() req, @Body() dto: UpdateProfileDto) {
        const userId = Number(req.user?.sub);
        return this.userService.updateMyProfile(userId, dto);
    }

    @Get('isAdmin/:id')
    async isUserAdmin(@Param('id') id: string) {
        const isAdmin = await this.userService.isUserAdmin(id);
        return { isAdmin };
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}