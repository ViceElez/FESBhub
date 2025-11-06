import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import { EmailService } from './email.service';
import {UserGuard} from "../guards/user.guard";

@Controller('email')
export class EmailController {
    constructor(private readonly EmailService: EmailService) {}

    @Post('verify')
    async verifyEmail(@Req() req, @Body('code') code: string) {
        return this.EmailService.verifyEmail(req.user?.sub, code)
    }

    @Post('resend-verification')
    async resendVerificationEmail(@Req() req) {
        return this.EmailService.resendVerificationEmail(req.user?.sub)
    }
}// triba napraivt da se ili posalje email ili nesto od usera na be tako da se moze upadeateat da je user emailVerificiran pa onda testiraj dalje, triba i za resend isto vjerojatno bit
