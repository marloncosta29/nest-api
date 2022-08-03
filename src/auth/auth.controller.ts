import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDTO: AuthDto) {
    console.log(signUpDTO);
    return this.authService.signUp();
  }

  @Post('sign-in')
  signIn() {
    return '';
  }
}
