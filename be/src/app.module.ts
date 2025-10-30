import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from "@nestjs/jwt";
import { EmailModule } from './email/email.module';

@Module({
  imports: [
      UserModule,
      AuthModule,
      PrismaModule,
      JwtModule.register({global:true,secret:process.env.JWT_SECRET}),
      EmailModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
