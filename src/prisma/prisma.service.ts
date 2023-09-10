import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          // url: process.env.DATABASE_URL,
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDatabase() {
    return this.$transaction([
      //trong quan he 1 - n, xoa n truoc
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
