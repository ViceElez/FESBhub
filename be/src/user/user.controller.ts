import { Controller,Get,Req,UseGuards } from '@nestjs/common';
import { UserGuard } from '../guards/user.guard';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {

    @Get('allUsers')
    async getAllUsers(@Req() req) {
        return { message: 'This action returns all users', user: req.user };
    }
}
