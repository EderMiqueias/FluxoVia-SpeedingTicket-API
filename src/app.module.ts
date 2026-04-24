import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { User } from './users/user.entity';
import { Ticket } from './tickets/ticket.entity';

@Module({
  imports: [
    // TypeORM configuration — reads connection settings from environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'fluxovia_tickets',
      entities: [User, Ticket],
      // In production, set this to false and use migrations instead
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    TicketsModule,
  ],
})
export class AppModule {}
