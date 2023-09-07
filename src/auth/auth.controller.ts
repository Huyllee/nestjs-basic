import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register() {
    return {
      a: 1,
      b: 2,
    };
  }

  @Post('login')
  login() {
    return 'login';
  }
}
