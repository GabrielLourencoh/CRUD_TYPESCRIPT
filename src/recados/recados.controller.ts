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
  UseGuards,
  // ParseIntPipe,
  // UsePipes,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
// import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

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

// @UseInterceptors(AuthTokenInterceptor)
@UseGuards(RoutePolicyGuard)
@Controller('recados') // Decorator de controle
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  // @HttpCode(201) com numero direto
  @HttpCode(HttpStatus.OK) // Retorna 200
  @Get('/') // Encontra todos os recados
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  // Encontra um recado
  @Get(':id') //estrutura (:nomedoparametroquequeremos)
  findOne(@Param('id') id: number) {
    // O decorator Param nos permite pegar determinados parametros da url
    return this.recadosService.findOne(id); // Usando o `` no lugar da '', podemos colocar variaveis na nossa msg
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    // Decorator @Body serve para trazer os dados enviados da nossa requisição e na frente, definimos a variavel que recebe esses dados enviados
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    // Preciso do id e do body da requisição
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
