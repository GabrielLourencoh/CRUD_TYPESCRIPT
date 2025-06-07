import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado) // O decorator @InjectRepository informa ao NestJS que queremos injetar um repositório do TypeORM vinculado à entidade Recado.
    private readonly recadoRepository: Repository<Recado>, // Criamos uma propriedade privada e somente leitura chamada recadoRepository, que será do tipo Repository<Recado>. Isso permite acessar métodos como .find(), .save(), .delete(), etc., diretamente no banco de dados para a entidade Recado.
  ) {}

  private lastId = 1; // Nosso ultimo recado
  private recados: Recado[] = [
    // Array que carrega nossos recados
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'Gabriel',
      para: 'Neusa',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado.');
    // Algumas opções de mais erros
    // BadRequestsException
    // UnauthorizedException
  }

  async findAll() {
    // async transforma em uma função assíncrona que espera uma promise
    const recados = await this.recadoRepository.find(); // await é aguardando encontrar todos os recados e retornar
    return recados;
  }

  async findOne(id: number) {
    // const recado = this.recados.find(item => item.id === id); // Ele acha o recado 1, e o '+' na frente do id, transforma ele de string para number

    // Pegando UM recado onde o id for igual ao id do banco
    const recado = await this.recadoRepository.findOne({
      where: {
        id: id,
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

  create(createRecadoDto: CreateRecadoDto) {
    // Pega o body como parametro
    this.lastId++; // Adiciona no ultimo id
    const id = this.lastId; // PEga o ultimo id e atribui ao novo criado

    const novoRecado = {
      // Cria um novo recado com o id e o body passado
      id,
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };

    this.recados.push(novoRecado); // Adiciona o novo recado no array de recados

    return novoRecado;
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      // Pega o indice passado na url
      item => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      // Recado nao existe
      this.throwNotFoundError();
    }

    // Verifica se o indice é existente
    const recadoExistente = this.recados[recadoExistenteIndex]; // Cria uma variavel que recebe os dados que tinha no array recados no indice passado

    this.recados[recadoExistenteIndex] = {
      // Inverte os dados que tinha naquela posição pra um novo passado
      ...recadoExistente,
      ...updateRecadoDto,
    };
    return this.recados[recadoExistenteIndex];
  }

  remove(id: number) {
    const recadoExistenteIndex = this.recados.findIndex(
      // Achando o indice do recado que desejamos apagar
      item => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      // Recado nao existe
      this.throwNotFoundError();
    }

    const recado = this.recados[recadoExistenteIndex];
    this.recados.splice(recadoExistenteIndex, 1); // Nos apagamos o item, se nao existe, nao faz nada

    return recado;
  }
}
