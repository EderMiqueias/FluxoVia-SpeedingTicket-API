import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './create-ticket.dto';

@Injectable()
export class TicketsService {
  create(_dto: CreateTicketDto, _userId: string): void {
    // sem implementação por enquanto
  }
}
