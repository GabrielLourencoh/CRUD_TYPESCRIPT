/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/require-await
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ErrorHandlingInterceptor executado ANTES');

    // await new Promise(resolve => setTimeout(resolve, 3000)); // Travando a promise ser resolvida

    // Capturando erro
    return next.handle().pipe(
      catchError(error => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }

          return new BadRequestException('Ocorreu um erro desconhecido.');
        });
      }),
    );
  }
}
