import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(1)
  placa: string;

  @IsNumber()
  @IsPositive()
  velocidade_registrada: number;

  @IsNumber()
  @IsPositive()
  limite_permitido: number;

  @IsString()
  @MinLength(1)
  id_aparelho_medidor: string;
}
