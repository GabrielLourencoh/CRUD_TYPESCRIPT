/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Patch,
  Query,
  Delete,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

//CRUD
// Create -> POST -> Criar um recado
// Read -> GET -> ler todos os recados
// Read -> GET -> ler um recado
// Update -> PACTH / PUT -> Atualizar um recado
// Delete -> DELETE -> Apagar um recado

// PATCH é utilizado para atualizar dados de um recurso
// PUT é utilizado para atualizar um recurso inteiro

// DTO – Data Transfer Object -> Objeto de transferencia de dados
// DTO -> Objeto simples -> No nest, serve tanto para validar dados / transformar dados

@Controller('recados') // Decorator de controle
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  // @HttpCode(201) com numero direto
  @HttpCode(HttpStatus.OK) // Retorna 200
  @Get('/') // Encontra todos os recados
  findAll(@Query() pagination: any) {
    const { limit = 10, offset = 0 } = pagination;
    return this.recadosService.findAll();
  }

  // Encontra um recado
  @Get(':id') //estrutura (:nomedoparametroquequeremos)
  findOne(@Param('id') id: string) {
    // O decorator Param nos permite pegar determinados parametros da url
    return this.recadosService.findOne(id); // Usando o `` no lugar da '', podemos colocar variaveis na nossa msg
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    // Decorator @Body serve para trazer os dados enviados da nossa requisição e na frente, definimos a variavel que recebe esses dados enviados
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecadoDto: UpdateRecadoDto) {
    // Preciso do id e do body da requisição
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recadosService.remove(id);
  }
}
