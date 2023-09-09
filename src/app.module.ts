import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NoteModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
