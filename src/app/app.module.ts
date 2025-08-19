import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import * as Joi from '@hapi/joi';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env', // Caminho da variavel de ambiente
      // ignoreEnvFile: true, // Ignora arquivos .env
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_DATABASE: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
        DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE as 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT ?? '5432', 10), // porta padrao
    //   username: process.env.DATABASE_USERNAME, // username padrao
    //   database: process.env.DATABASE_DATABASE, // database padrao
    //   password: process.env.DATABASE_PASSWORD, // senha do banco
    //   autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega entidades sem precisar especificá-las
    //   synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o BD. Não deve ser usado em produção
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<'postgres'>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          database: configService.get<string>('database.database'),
          password: configService.get<string>('database.password'),
          autoLoadEntities: configService.get<boolean>(
            'database.autoLoadEntities',
          ),
          synchronize: configService.get<boolean>('database.synchronize'),
        };
      },
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
