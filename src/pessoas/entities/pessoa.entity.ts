import { IsEmail } from 'class-validator';
import { Recado } from 'src/recados/entities/recado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail() // Usando o class-validator para validar o email
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  nome: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;

  // Uma pessoa pode ter enviado muitos recados com seu id atrelado "de"
  // Esses recados sao relacionados ao campo "de" na entidade Recado
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  // Uma pessoa pode ter recebido muitos recados com seu id atrelado "para"
  // Esses recados sao relacionados ao campo "para" na entidade Recado
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];
}
