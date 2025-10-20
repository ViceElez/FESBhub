import { Controller } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Body, Post} from "@nestjs/common";
import {RegisterDto} from './dtos/index'

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService:AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {
    }
}
