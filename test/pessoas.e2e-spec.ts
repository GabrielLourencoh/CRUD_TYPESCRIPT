/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CreatePessoaDto } from 'src/pessoas/dto/create-pessoa.dto';

const login = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth')
    .send({ email, password });

  return response.body.accessToken;
};

const createUserAndLogin = async (app: INestApplication) => {
  const nome = 'Any User';
  const email = 'anyuser@email.com';
  const password = '123456';

  await request(app.getHttpServer()).post('/pessoas').send({
    nome,
    email,
    password,
  });

  return login(app, email, password);
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

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

    authToken = await createUserAndLogin(app);
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

    it('deve gerar um erro de e-mail já existe', async () => {
      const createPessoaDto: CreatePessoaDto = {
        email: 'gabriel@email.com',
        nome: 'Gabriel',
        password: '123456',
      };

      await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe('E-mail já está cadastrado.');
    });

    it('deve gerar um erro de senha curta', async () => {
      const createPessoaDto: CreatePessoaDto = {
        email: 'gabriel@email.com',
        nome: 'Gabriel',
        password: '123', // Este campo é inválido
      };

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual([
        'password must be longer than or equal to 5 characters',
      ]);
      expect(response.body.message).toContain(
        'password must be longer than or equal to 5 characters',
      );
    });
  });

  describe('/pessoas/:id (GET)', () => {
    it('deve retornar Unauthorized quando usuário não está logado', async () => {
      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'gabriel@email.com',
          password: '123456',
          nome: 'Gabriel',
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/pessoas/' + pessoaResponse.body.id)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        message: 'Não logado!',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('deve retornar a Pessoa quando usuário está logado', async () => {
      const createPessoaDto: CreatePessoaDto = {
        email: 'gabriel@email.com',
        nome: 'Gabriel',
        password: '123456',
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: createPessoaDto.email,
          password: createPessoaDto.password,
          nome: createPessoaDto.nome,
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/pessoas/' + pessoaResponse.body.id)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

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

  describe('PATCH /pessoas/:id', () => {
    it('deve atualizar uma pessoa', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'luiz@email.com',
          nome: 'Luiz',
          password: '123456',
        })
        .expect(HttpStatus.CREATED);

      const personId = createResponse.body.id;

      const authToken = await login(app, 'luiz@email.com', '123456');

      const updateResponse = await request(app.getHttpServer())
        .patch(`/pessoas/${personId}`)
        .send({
          nome: 'Luiz Atualizado',
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          id: personId,
          nome: 'Luiz Atualizado',
        }),
      );
    });

    it('deve retornar erro para pessoa não encontrada', async () => {
      await request(app.getHttpServer())
        .patch('/pessoas/9999') // ID fictício
        .send({
          nome: 'Nome Atualizado',
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /pessoas/:id', () => {
    it('deve remover uma pessoa', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'luiz@email.com',
          nome: 'Luiz',
          password: '123456',
        })
        .expect(HttpStatus.CREATED);

      const authToken = await login(app, 'luiz@email.com', '123456');

      const personId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/pessoas/${personId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.email).toBe('luiz@email.com');
    });

    it('deve retornar erro para pessoa não encontrada', async () => {
      await request(app.getHttpServer())
        .delete('/pessoas/9999') // ID fictício
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
