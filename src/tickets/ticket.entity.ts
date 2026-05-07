import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Vehicle license plate */
  @Column({ length: 20 })
  placa: string;

  /** Speed recorded by the device (km/h) */
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  velocidade_registrada: number;

  /** Speed limit in effect at the location (km/h) */
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  limite_permitido: number;

  /** Identifier of the speed-measuring device */
  @Column({ length: 100 })
  id_aparelho_medidor: string;

  /** The user (operator) who recorded this ticket */
  @Column({ length: 20 })
  user: string;

  @CreateDateColumn()
  createdAt: Date;
}
