import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    const key = `tickets/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    });

    try {
      await this.s3Client.send(command);

      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      // O link pré-assinado será válido por 24 horas.
      const urlPreAssinada = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 86400 });
      return urlPreAssinada;
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw new Error('Falha ao salvar o PDF na AWS');
    }
  }
}
