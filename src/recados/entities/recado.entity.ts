import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn() // Coluna gerada como um id
  id: number; // Poderia ser um UUID, o id deve ser sequencial: 1, 2, 3, 4, 5

  @Column({ type: 'varchar', length: '255' }) // Se não passar nada, continua sendo uma coluna de texto sem tamanho mesmo
  texto: string;

  @Column({ type: 'varchar', length: '50' })
  de: string;

  @Column({ type: 'varchar', length: '50' })
  para: string;

  @Column({ default: false }) // Valor padrão é falso
  lido: boolean;

  @Column()
  data: Date; // createdAt

  @CreateDateColumn()
  createdAt?: Date; // createdAt

  @CreateDateColumn()
  updateAt?: Date; // updateAt
}
