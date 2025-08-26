import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { RoutePolicyGuard } from './guards/route-policy.guard';

@Global() // Pode ser usado na aplicação inteira
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService, // Toda vez que for chamado esse contrato
      useClass: BcryptService, // Usa essa classe aqui que implementa o contrato HashingService
    },
    AuthService,
    AuthTokenGuard,
    RoutePolicyGuard,
  ],
  exports: [
    HashingService,
    JwtModule,
    ConfigModule,
    TypeOrmModule,
    AuthTokenGuard,
    RoutePolicyGuard,
  ],
})
export class AuthModule {}
