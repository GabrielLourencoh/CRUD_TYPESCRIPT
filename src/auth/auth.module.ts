import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Global() // Pode ser usado na aplicação inteira
@Module({
  providers: [
    {
      provide: HashingService, // Toda vez que for chamado esse contrato
      useClass: BcryptService, // Usa essa classe aqui que implementa o contrato HashingService
    },
  ],
})
export class AuthModule {}
