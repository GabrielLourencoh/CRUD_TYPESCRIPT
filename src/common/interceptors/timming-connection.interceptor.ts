import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class TimmingConnectionInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/require-await
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    // console.log('TimmingConnectionInterceptor executado ANTES');

    // await new Promise(resolve => setTimeout(resolve, 3000)); // Travando a promise ser resolvida

    return next.handle().pipe(
      // Função tap é para apenas observar
      tap(() => {
        // data => sao os dados da resposta
        const finalTime = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const elapsed = finalTime - startTime;

        // console.log(
        //   `TimmingConnectionInterceptor levou ${elapsed}ms para executar`,
        // );
      }),
    );
  }
}
