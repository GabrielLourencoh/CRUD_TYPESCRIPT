import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'; // IMPORTANTE

export class OutroMiddleware implements NestMiddleware {
  //Interface padrão de um middleware
  // req -> request, res -> response, next -> NextFunction. OBS: todos do express
  use(req: Request, res: Response, next: NextFunction) {
    console.log('OutroMiddleware: Olá');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'Gabriel',
        sobrenome: 'Lourenço',
      };
    }

    res.setHeader('CABECALHO', 'Do Middleware');
    // Terminando a cadeia de chamadas, nada será executado após esse middleware ser executado
    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });

    // Ele chama ou o proximo middleware ou o controller e vai seguindo os passos
    next();

    // Executando uma ação após o proximo middleware
    console.log('OutroMiddleware: Tchau');
  }
}
