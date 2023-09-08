import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          firstName: 'Huy',
          lastName: 'Lee',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (err) {
      if (err.code == 'P2002') {
        throw new ForbiddenException('Error in credentials');
      }
    }
  }

  login(authDTO: AuthDTO) {
    return {
      message: `Login user success.`,
    };
  }
}
