import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor() {
    // Inicializa o cliente da AWS usando as variáveis de ambiente (.env)
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadPdf(pdfBuffer: Buffer, fileName: string): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `tickets/${fileName}`,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    });

    try {
      await this.s3Client.send(command);
      // Retornamos a possível URL do arquivo (se o bucket for público) ou apenas o nome
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/tickets/${fileName}`;
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw new Error('Falha ao salvar o PDF na AWS');
    }
  }
}
