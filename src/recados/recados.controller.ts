import { Body, Patch, Query, Delete, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

//CRUD
// Create -> POST -> Criar um recado
// Read -> GET -> ler todos os recados
// Read -> GET -> ler um recado
// Update -> PACTH / PUT -> Atualizar um recado
// Delete -> DELETE -> Apagar um recado

// PATCH é utilizado para atualizar dados de um recurso
// PUT é utilizado para atualizar um recurso inteiro

@Controller('recados') // Decorator de controle
export class RecadosController {
    // @HttpCode(201) com numero direto
    @HttpCode(HttpStatus.OK) // Retorna 200
    @Get('/') // Encontra todos os recados
    findAll(@Query() pagination: any) {
        const { limit = 10, offset = 0 } = pagination;
        return `Retorna todos os recados. Limit=${limit}, Offset=${offset}`;
    }

    // Encontra um recado
    @Get(':id') //estrutura (:nomedoparametroquequeremos)
    findOne(@Param('id') id: string) { // O decorator Param nos permite pegar determinados parametros da url
        return `Essa roda retorna UM recado ID ${id}`; // Usando o `` no lugar da '', podemos colocar variaveis na nossa msg
    }

    @Post()
    create(@Body() body: any) { // Decorator @Body serve para trazer os dados enviados da nossa requisição e na frente, definimos a variavel que recebe esses dados enviados
        return body;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) { // Preciso do id e do body da requisição
        return {
            id, 
            ...body
        }
    }

    @Delete(':id')
    remove(@Param('id') id: string) { 
        return `Essa roda apaga o recado ID ${id}`;
    }
}
