import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Hybrid register/login endpoint logic:
   *
   * 1. Look up the user by e-mail in the database.
   * 2a. If the user does NOT exist → register: hash the password with bcrypt,
   *     create the user record, then issue a JWT.
   * 2b. If the user ALREADY EXISTS → login: compare the provided plain-text
   *     password with the stored bcrypt hash.
   *     - Match  → issue a JWT.
   *     - No match → throw HTTP 401 Unauthorized.
   */
  async authenticate(dto: AuthDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // User not found → register a new account
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user = await this.usersService.create(email, hashedPassword);
    } else {
      // User found → validate the provided password against the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas.');
      }
    }

    // Generate JWT with the user's id and email as payload
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
