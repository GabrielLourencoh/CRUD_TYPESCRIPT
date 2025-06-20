import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Aqui, importamos o class-validator e o class-transformer, dessa forma: npm i class-validator class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove chaves que não estao no DTO
      forbidNonWhitelisted: true, // Levantar erro quando a chave nao existir
      transform: false, // Tenta transformar os tipos de dados de parametros e dtos, se true
    }),
    new ParseIntIdPipe(),
  ); // Criando uma instancia do validationpipe
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
