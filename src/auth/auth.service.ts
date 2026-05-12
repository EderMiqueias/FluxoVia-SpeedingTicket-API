import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  authenticate(dto: AuthDto): { access_token: string } {
    const payload = { email: dto.email };
    if (!payload.email.endsWith('@ufrpe.br')) {
      throw new UnauthorizedException('Invalid email domain');
    }
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
