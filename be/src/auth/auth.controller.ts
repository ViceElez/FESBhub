import {Controller, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Body, Post,Req,Get,Query} from "@nestjs/common";
import {RegisterDto,LoginDto} from './dtos'
import {UserGuard} from "../guards/user.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService:AuthService) {}
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.AuthService.register(registerDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.AuthService.login(loginDto)
    }

    @UseGuards(UserGuard)
    @Post('logout')
    async logout(@Req() req) {
        return this.AuthService.logout(req.user?.sub)
    }

}
