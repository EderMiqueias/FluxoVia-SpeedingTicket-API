import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { CreateTicketDto } from './create-ticket.dto';
import { AwsS3Service } from './utils/aws-s3.service';
import { EmailService } from './utils/email.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly emailService: EmailService,
  ) {}

  async processTicket(ticketData: CreateTicketDto) {
    const pdfBuffer = await this.generateTicketPdf(ticketData);
    const fileName = `${ticketData.placa}_${Date.now()}.pdf`;
    const s3Url = await this.awsS3Service.uploadPdf(pdfBuffer, fileName);
    await this.emailService.sendTicketEmail(ticketData.email_condutor, pdfBuffer, fileName);

    return {
      message: 'Multa processada, salva na AWS e enviada por e-mail com sucesso!',
      url: s3Url
    };
  }

  async generateTicketPdf(dto: CreateTicketDto): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), 'assets', 'templates', 'ticket.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    const excessPercent =
      ((dto.velocidade_registrada - dto.limite_permitido) / dto.limite_permitido) * 100;

    let valor: string;
    let descricao_infracao: string;

    if (excessPercent <= 20) {
      valor = '88,38';
      descricao_infracao = 'Infração grave detectada por radar fixo.';
    } else if (excessPercent <= 50) {
      valor = '195,23';
      descricao_infracao = 'Infração gravíssima detectada por radar fixo.';
    } else {
      valor = '293,47';
      descricao_infracao = 'Infração gravíssima com fator multiplicador detectada por radar fixo.';
    }

    const dataEmissao = new Date().toLocaleDateString('pt-BR');

    const replacements: Record<string, string> = {
      '{{proprietario}}': dto.proprietario,
      '{{placa}}': dto.placa.toUpperCase(),
      '{{uf}}': dto.uf.toUpperCase(),
      '{{velocidade_registrada}}': String(dto.velocidade_registrada),
      '{{limite_permitido}}': String(dto.limite_permitido),
      '{{id_aparelho_medidor}}': dto.id_aparelho_medidor,
      '{{data_emissao}}': dataEmissao,
      '{{valor}}': valor,
      '{{descricao_infracao}}': descricao_infracao,
    };

    for (const [token, value] of Object.entries(replacements)) {
      html = html.replaceAll(token, value);
    }

    let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
    try {
      // browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      return Buffer.from(pdfBuffer);
    } catch (err: any) {
      throw new InternalServerErrorException(`Falha ao gerar o PDF da multa. Erro: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
