/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import globalConfig from 'src/global-config/global.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { RecadosModule } from 'src/recados/recados.module';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import jwtConfig from 'src/auth/config/jwt.config';
import appConfig from 'src/app/config/app.config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing',
          password: '240024',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        RecadosModule,
        PessoasModule,
        AuthModule,
        GlobalConfigModule,
        // Temporario o debaixo
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
          load: [jwtConfig],
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/pessoas (POST)', () => {
    it('deve criar uma pessoa com sucesso', async () => {
      const createPessoaDto = {
        email: 'gabriel@email.com',
        password: '123456',
        nome: 'Gabriel',
      };
      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        email: createPessoaDto.email,
        passwordHash: expect.any(String),
        nome: createPessoaDto.nome,
        active: true,
        createdAt: expect.any(String),
        updateAt: expect.any(String),
        picture: '',
        id: expect.any(Number),
      });
    });
  });
});
