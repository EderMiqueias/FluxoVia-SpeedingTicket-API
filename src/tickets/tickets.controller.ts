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

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  @HttpCode(HttpStatus.CREATED)
  createMulta(@Body() dto: CreateTicketDto, @Request() req: AuthenticatedRequest) {
    this.ticketsService.create(dto, req.user.userId);
  }
}
