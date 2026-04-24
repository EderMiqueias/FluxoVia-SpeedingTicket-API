import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth — public endpoint (no JWT required).
   * Acts as a hybrid register/login: creates the user if new,
   * or validates credentials if the user already exists.
   * Returns a JWT access_token in both cases.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  authenticate(@Body() dto: AuthDto) {
    return this.authService.authenticate(dto);
  }
}
