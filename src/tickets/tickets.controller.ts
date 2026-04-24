import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './create-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/** Shape of request.user after JWT validation by Passport */
interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   * POST /tickets — protected route (JWT required in Authorization header).
   * Receives the speeding-ticket payload and persists it to the database.
   * The authenticated user's id is extracted from the JWT via Passport.
   */
  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  @HttpCode(HttpStatus.CREATED)
  createTicket(@Body() dto: CreateTicketDto, @Request() req: AuthenticatedRequest) {
    return this.ticketsService.create(dto, req.user.userId);
  }

  /**
   * POST /multas — alias for POST /tickets (same behaviour).
   */
  @UseGuards(JwtAuthGuard)
  @Post('multas')
  @HttpCode(HttpStatus.CREATED)
  createMulta(@Body() dto: CreateTicketDto, @Request() req: AuthenticatedRequest) {
    return this.ticketsService.create(dto, req.user.userId);
  }
}
