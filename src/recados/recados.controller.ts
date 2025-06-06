import { Controller, Get, Param } from '@nestjs/common';

@Controller('recados') // Decorator de controle
export class RecadosController {
    // Encontra todos os recados
    @Get('/')
    findAll() {
        return 'Essa roda retorna todos os recados';
    }

    // Encontra um recado
    @Get(':id') //estrutura (:nomedoparametroquequeremos)
    findOne(@Param('id') id: string) { // O decorator Param nos permite pegar determinados parametros da url
        console.log(id);
        return `Essa roda retorna UM recado ID ${id}`; // Usando o `` no lugar da '', podemos colocar variaveis na nossa msg
    }
}
