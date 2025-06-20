import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  // Código padrao
  intercept(
    // Informações sobre o contexto de onde a requisição está sendo executado, como: Se é um HTTP, o controller, método, request e response...
    context: ExecutionContext,
    // next: Pipeline de chamada, próxima chama de execução, próxima ação na fila
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = context.switchToHttp().getResponse(); // Pegando o objeto de resposta

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.setHeader('X-Custom-Header', 'O Valor do cabeçalho');

    return next.handle();
  }
}
