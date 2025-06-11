import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado) // O decorator @InjectRepository informa ao NestJS que queremos injetar um repositório do TypeORM vinculado à entidade Recado.
    private readonly recadoRepository: Repository<Recado>, // Criamos uma propriedade privada e somente leitura chamada recadoRepository, que será do tipo Repository<Recado>. Isso permite acessar métodos como .find(), .save(), .delete(), etc., diretamente no banco de dados para a entidade Recado.
    private readonly pessoasService: PessoasService, // Injeta o serviço de pessoas para acessar ou manipular dados da entidade Pessoa (ex: buscar remetente ou destinatário de um recado)
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado.');
    // Algumas opções de mais erros
    // BadRequestsException
    // UnauthorizedException
  }

  async findAll() {
    // async transforma em uma função assíncrona que espera uma promise
    const recados = await this.recadoRepository.find({
      relations: ['de', 'para'],
      order: {
        // Ordenando pelo id em ordem decrescente
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    }); // await é aguardando encontrar todos os recados e retornar
    return recados;
  }

  async findOne(id: number) {
    // const recado = this.recados.find(item => item.id === id); // Ele acha o recado 1, e o '+' na frente do id, transforma ele de string para number

    // Pegando UM recado onde o id for igual ao id do banco
    const recado = await this.recadoRepository.findOne({
      where: {
        id: id,
      },
      relations: ['de', 'para'],
      order: {
        // Ordenando pelo id em ordem decrescente
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (recado) {
      // Se p recado existe, ele retorna ele, mas se nao existe, ele passa e retorna um erro
      return recado;
    }
    // Dois parametros, um de texto e um do código do erro
    // throw new HttpException('Recado não encontrado.', 404);
    // throw new HttpException('Recado não encontrado.', HttpStatus.NOT_FOUND);
    // throw new NotFoundException('Recado não encontrado.'); // Esse ultimo, faz a msm coisa, porem mais curto
    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;
    // Encontrar a pessoa que está criando o recado
    const de = await this.pessoasService.findOne(deId);

    // Encontrar a pessoa para quem está sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      // Cria um novo recado com o id e o body passado
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };
    const recado = await this.recadoRepository.create(novoRecado); // Cria o novo recado
    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        id: recado.para.id,
      },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      texto: updateRecadoDto?.texto,
    };
    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    if (!recado) {
      return this.throwNotFoundError();
    }

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) {
      return this.throwNotFoundError();
    }

    return await this.recadoRepository.remove(recado);
  }
}
