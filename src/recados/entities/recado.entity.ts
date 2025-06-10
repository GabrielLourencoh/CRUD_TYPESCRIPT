import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn() // Coluna gerada como um id
  id: number; // Poderia ser um UUID, o id deve ser sequencial: 1, 2, 3, 4, 5

  @Column({ type: 'varchar', length: '255' }) // Se não passar nada, continua sendo uma coluna de texto sem tamanho mesmo
  texto: string;

  @Column({ default: false }) // Valor padrão é falso
  lido: boolean;

  @Column()
  data: Date; // createdAt

  @CreateDateColumn()
  createdAt?: Date; // createdAt

  @CreateDateColumn()
  updateAt?: Date; // updateAt

  // Muitos recados podem ser enviados por uma unica pessoa (emissor)
  @ManyToOne(() => Pessoa)
  // Especifica a coluna "de" que armazena o ID da pessoa que enviou o recado
  @JoinColumn({ name: 'de' })
  de: Pessoa;

  // Muitos recados podem ser enviados por uma unica pessoa (destinatario)
  @ManyToOne(() => Pessoa)
  // Especifica a coluna "para" que armazena o ID da pessoa que recebe o recado
  @JoinColumn({ name: 'para' })
  para: Pessoa;
}
