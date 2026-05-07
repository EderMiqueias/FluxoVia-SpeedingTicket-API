import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  authenticate(dto: AuthDto): { access_token: string } {
    const payload = { email: dto.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
