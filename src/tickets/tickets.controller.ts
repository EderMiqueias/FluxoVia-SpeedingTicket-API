import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
  async createMulta(
    @Body() dto: CreateTicketDto,
    @Request() _req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.ticketsService.generateTicketPdf(dto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="multa-${dto.placa}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
