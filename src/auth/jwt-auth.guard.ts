import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Reusable guard that protects routes requiring a valid JWT Bearer token */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
