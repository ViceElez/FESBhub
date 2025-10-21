import { Controller } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Body, Post} from "@nestjs/common";
import {RegisterDto,LoginDto} from './dtos'

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService:AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.AuthService.register(dto)
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.AuthService.login(dto)
    }
}
