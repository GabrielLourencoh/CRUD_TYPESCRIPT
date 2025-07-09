import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global() // Pode ser usado na aplicação inteira
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService, // Toda vez que for chamado esse contrato
      useClass: BcryptService, // Usa essa classe aqui que implementa o contrato HashingService
    },
    AuthService,
  ],
  exports: [HashingService],
})
export class AuthModule {}
