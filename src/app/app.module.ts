import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env', // Caminho da variavel de ambiente
      // ignoreEnvFile: true, // Ignora arquivos .env
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10), // porta padrao
      username: process.env.DATABASE_USERNAME, // username padrao
      database: process.env.DATABASE_DATABASE, // database padrao
      password: process.env.DATABASE_PASSWORD, // senha do banco
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega entidades sem precisar especificá-las
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o BD. Não deve ser usado em produção
    }),
    RecadosModule,
    PessoasModule,
    AuthModule,
    // Temporario o debaixo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: MyExceptionFilter,
    // },
  ],
  exports: [],
})
export class AppModule {}
