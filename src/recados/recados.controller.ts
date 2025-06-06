import { Controller, Get } from '@nestjs/common';

@Controller('recados')
export class RecadosController {
    // Encontra todos os recados
    @Get('/')
    findAll() {
        return 'Essa roda retorna todos os recados';
    }

    // Encontra um recado
    @Get(':id') //estrutura (:nomedoparametroquequeremos)
    findOne() {
        return 'Essa roda retorna UM recado';
    }
}
