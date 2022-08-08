import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() authDTO: AuthDto) {
    return this.authService.signUp(authDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() authDTO: AuthDto) {
    return this.authService.signIn(authDTO);
  }
}
