import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendTicketEmail(toEmail: string, pdfBuffer: Buffer, fileName: string) {
    try {
      await this.transporter.sendMail({
        from: '"FluxoVia Sistema" <nao-responda@fluxovia.com>',
        to: toEmail,
        subject: 'Aviso de Autuação de Trânsito - FluxoVia',
        text: 'Você recebeu uma autuação de trânsito. O PDF com os detalhes está em anexo.',
        attachments: [
          {
            filename: fileName,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar o e-mail de notificação');
    }
  }
}