import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
// import { Request } from 'express';
import { GetUser } from '../auth/decorator/user.decorator';
import { MyJwtGuard } from '../auth/guard';

@UseGuards(MyJwtGuard)
@Controller('users')
export class UserController {
  // @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
