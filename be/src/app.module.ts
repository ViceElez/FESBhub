import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import {JwtModule} from "@nestjs/jwt";
import { ProfModule } from './prof/prof.module';
import { CommentProfModule } from './comment-prof/comment-prof.module';
import { SubjModule } from './subj/subj.module';
import { CommentSubjModule } from './comment-subj/comment-subj.module';
import { EmailModule } from './email/email.module';
import { FoldersModule } from './mats/folders/folderModule/folders.module';

@Module({
  imports: [
      UserModule,
      AuthModule,
      PrismaModule,
    PostsModule,
      JwtModule.register({global:true,secret:process.env.JWT_SECRET}),
      ProfModule,
      CommentProfModule,
      SubjModule,
      CommentSubjModule,
      EmailModule,
      FoldersModule,],
  providers: [],
  controllers: [],
})
export class AppModule {}
