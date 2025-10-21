import { Controller } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Body, Post} from "@nestjs/common";
import {RegisterDto,LoginDto,RefreshTokenDto} from './dtos'

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

    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto:RefreshTokenDto) {
        return this.AuthService.refreshToken(refreshTokenDto.refreshToken)
    }

}
