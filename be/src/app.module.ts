import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
      UserModule,
      AuthModule,
      PrismaModule,
      JwtModule.register({global:true,secret:process.env.JWT_SECRET})],
  providers: [],
  controllers: [],
})
export class AppModule {}
