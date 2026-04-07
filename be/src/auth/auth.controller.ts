import {Controller, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Body, Post,Req,Res} from "@nestjs/common";
import {RegisterDto,LoginDto} from './dtos'
import {UserGuard} from "../guards";
import type {Response,Request} from "express";
import type {logoutRequest} from "../types";

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService:AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto,
                   @Res({ passthrough: true }) res: Response) {
        return this.AuthService.register(registerDto,res);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto,
                @Res({ passthrough: true }) res: Response) {
        return this.AuthService.login(loginDto,res);
    }

    @UseGuards(UserGuard)
    @Post('logout')
    async logout(@Req() req: logoutRequest, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken');
        return this.AuthService.logout(req.user!.sub)
    }

    @Post('refresh-access-token')
    async refreshToken(@Req() req:Request) {
        return this.AuthService.refreshAccessToken(req.cookies['refreshToken'])
    }
}