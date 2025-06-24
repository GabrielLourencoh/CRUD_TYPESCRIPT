import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    // console.log('ChangeDataInterceptor executado ANTES');

    // Se não, usamos o tap para pegar os dados da resposta e salvamos em cache essa url
    return next.handle().pipe(
      map(data => {
        // Verifica se a resposta é um array, se sim, ele retorna a resposta e o tamanho do array, se não, só retorna a resposta
        if (Array.isArray(data)) {
          return {
            data,
            count: data.length,
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }
}
