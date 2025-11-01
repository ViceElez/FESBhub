import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import { EmailService } from './email.service';
import {UserGuard} from "../guards/user.guard";

@Controller('email')
export class EmailController {
    constructor(private readonly EmailService: EmailService) {}

    @UseGuards(UserGuard)
    @Post('verify')
    async verifyEmail(@Req() req, @Body('code') code: string) {
        return this.EmailService.verifyEmail(req.user?.sub, code)
    }

    @UseGuards(UserGuard)
    @Post('resend-verification')
    async resendVerificationEmail(@Req() req) {
        return this.EmailService.resendVerificationEmail(req.user?.sub)
    }
}
