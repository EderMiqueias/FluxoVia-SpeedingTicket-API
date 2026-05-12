import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AwsS3Service } from './utils/aws-s3.service';
import { EmailService } from './utils/email.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, AwsS3Service, EmailService],
})
export class TicketsModule {}
