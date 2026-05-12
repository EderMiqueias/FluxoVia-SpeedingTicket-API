import { IsString, IsNumber, IsPositive, MinLength, Length } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(1)
  proprietario: string;

  @IsString()
  @MinLength(1)
  placa: string;

  @IsString()
  @Length(2, 2)
  uf: string;

  @IsNumber()
  @IsPositive()
  velocidade_registrada: number;

  @IsNumber()
  @IsPositive()
  limite_permitido: number;

  @IsString()
  @MinLength(1)
  id_aparelho_medidor: string;

  @IsString()
  @MinLength(1)
  email: string;
}
