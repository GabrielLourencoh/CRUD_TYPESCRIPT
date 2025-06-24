import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  // Código padrao
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest(); // Obtendo a requisição
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = request.headers.authorization?.split(' ')[1]; // Pegando o token

    // Esse 123456 representa o token e faz uma simulação para verificar se o token passado é esse msm. Se não, retorna erro e se sim, deixa passar
    if (!token || token != '123456') {
      throw new UnauthorizedException('Usuário não logado');
    }

    return next.handle();
  }
}
