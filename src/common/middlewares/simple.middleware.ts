import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'; // IMPORTANTE

export class SimpleMiddleware implements NestMiddleware {
  //Interface padrão de um middleware
  // req -> request, res -> response, next -> NextFunction. OBS: todos do express
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Olá');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'Gabriel',
        sobrenome: 'Lourenço',
      };
    }

    // Se quisermos, podemos enviar excessões de erros tbm, dessa forma:
    // if (authorization) {
    //   throw new BadRequestException('Estou enviando um erro');
    // }

    res.setHeader('CABECALHO', 'Do Middleware');

    // Terminando a cadeia de chamadas, nada será executado após esse middleware ser executado
    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });

    // Ele chama ou o proximo middleware ou o controller e vai seguindo os passos
    next(); // Próximo middleware

    // return next(); // Se eu colocar um return, nada que está abaixo dessa linha será executado

    // Executando uma ação após o proximo middleware
    console.log('SimpleMiddleware: Tchau');

    // on checa o status da conexao e faz alguma coisa se o status for esse passado.
    res.on('finish', () => {
      console.log('SimpleMiddleware: Terminou');
    });
  }
}
