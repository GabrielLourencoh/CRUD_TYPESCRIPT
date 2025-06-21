/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { of, tap } from 'rxjs';

@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('SimpleCacheInterceptor executado ANTES');

    const request = context.switchToHttp().getRequest(); // Pegando a request da requisição
    const url = request.url; // PEgando a url da requisição

    // Verificamos se a url ja esta no cache, se sim, apenas retorna ela
    if (this.cache.has(url)) {
      console.log('Está no cache', url);
      return of(this.cache.get(url));
    }

    await new Promise(resolve => setTimeout(resolve, 3000)); // Travando o servidor por alguns segundos

    // Se não, usamos o tap para pegar os dados da resposta e salvamos em cache essa url
    return next.handle().pipe(
      tap(data => {
        this.cache.set(url, data);
        console.log('Armazenado em cache', url);
      }),
    );
  }
}
