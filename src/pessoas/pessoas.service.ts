/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm/repository/Repository';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PessoasService {
  constructor(
    // Criando um repositório para a entidade Pessoa
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password,
      );
      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash: passwordHash, // Aqui deve ser o hash da senha
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(dadosPessoa);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23505') {
        // '23505' é o erro retornado se caso esse email ja esteja cadastrado
        throw new ConflictException('E-mail já está cadastrado.');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        // orderna por ordem descrescente no ID
        id: 'desc',
      },
    });

    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return pessoa;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
    };

    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );

      dadosPessoa['passwordHash'] = passwordHash;
    }

    // Encontrando a pessoa
    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa');
    }

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}
