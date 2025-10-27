import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from "@nestjs/jwt";
import { ProfModule } from './prof/prof.module';
import { CommentProfModule } from './comment-prof/comment-prof.module';
import { SubjModule } from './subj/subj.module';
import { CommentSubjModule } from './comment-subj/comment-subj.module';

@Module({
  imports: [
      UserModule,
      AuthModule,
      PrismaModule,
      JwtModule.register({global:true,secret:process.env.JWT_SECRET}),
      ProfModule,
      CommentProfModule,
      SubjModule,
      CommentSubjModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
