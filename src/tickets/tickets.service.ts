import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
  ) {}

  /** Insert a new speeding ticket record into the database */
  create(dto: CreateTicketDto, userId: string): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...dto,
      user: { id: userId },
    });
    return this.ticketsRepository.save(ticket);
  }
}
