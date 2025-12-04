import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import * as argon from "argon2";
import {createTransport} from "nodemailer";

@Injectable()
export class EmailService {
    private transporter:any;

    constructor(
        private readonly prisma: PrismaService
    ) {
        this.transporter = createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendVerificationEmail(userId: number, userEmail: string, userFirstName: string) {
        const { verificationToken } = await this.createVerificationEmail(userId);

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userEmail,
                subject: "Please verify your email",
                html: `<h1>Hello, ${userFirstName}!</h1>
                       <p>Thank you for registering. Please verify your email by typing this code: ${verificationToken}</p>
                       <p>This code will expire in 10 minutes.</p>`
            });
        } catch (error) {
            console.error("Error sending verification email:", error);
            return error;
        }
    }

    async createVerificationEmail(userId: number) {
        const crypto = require('crypto');
        const verificationToken = crypto.randomInt(100000, 999999).toString();
        const hashedVerificationToken = await argon.hash(verificationToken);

        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);

        await this.prisma.emailVerificationToken.create({
            data: {
                token: hashedVerificationToken,
                userId,
                expiresAt: expirationDate
            }
        });

        return { verificationToken };
    }

    async verifyEmail(email: string, code: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('User not found');
        }

        const verificationTokenRecord = await this.prisma.emailVerificationToken.findFirst({
            orderBy: { createdAt: 'desc' },
            where: { userId: user.id }
        });

        if (!verificationTokenRecord) {
            throw new Error('Invalid or expired verification code');
        }

        if (verificationTokenRecord.expiresAt <= new Date()) {
            throw new Error('Verification code has expired');
        }

        const isCodeValid = await argon.verify(verificationTokenRecord.token, code);

        if (!isCodeValid) {
            throw new UnauthorizedException('Invalid verification code❌');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true }
        });

        await this.prisma.emailVerificationToken.deleteMany({
            where: { userId: user.id }
        });

        return { message: '✅ Email verified successfully!' };
    }

    async resendVerificationEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('User not found');
        }

        await this.prisma.emailVerificationToken.deleteMany({
            where: { userId: user.id }
        });

        await this.sendVerificationEmail(user.id, user.email, user.firstName);
    }

    async checkEmailExists(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        return { exists: !!user && !user.isEmailVerified };
    }
}
