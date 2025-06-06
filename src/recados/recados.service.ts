/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
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

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    const recado = this.recados.find(item => item.id === +id); // Ele acha o recado 1, e o '+' na frente do id, transforma ele de string para number
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

  create(body: any) {
    // Pega o body como parametro
    this.lastId++; // Adiciona no ultimo id
    const id = this.lastId; // PEga o ultimo id e atribui ao novo criado

    const novoRecado = {
      // Cria um novo recado com o id e o body passado
      id,
      ...body,
    };
    this.recados.push(novoRecado); // Adiciona o novo recado no array de recados

    return novoRecado;
  }

  update(id: string, body: any) {
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
      ...body,
    };
    return this.recados[recadoExistenteIndex];
  }

  remove(id: string) {
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
