import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly EmailService: EmailService) {}

    @Post('verify')
    async verifyEmail(@Body('email') email: string, @Body('code') code: string) {
        return this.EmailService.verifyEmail(email, code)
    }

    @Post('resend-verification')
    async resendVerificationEmail(@Body('email') email: string) {
        return this.EmailService.resendVerificationEmail(email)
    }

    @Get('email-exists')
    async checkEmailExists(@Query('email') email:string){
        return this.EmailService.checkEmailExists(email)
    }
}// triba napraivt da se ili posalje email ili nesto od usera na be tako da se moze upadeateat da je user emailVerificiran pa onda testiraj dalje, triba i za resend isto vjerojatno bit
