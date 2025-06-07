import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Aqui, importamos o class-validator e o class-transformer, dessa forma: npm i class-validator class-transformer
  app.useGlobalPipes(new ValidationPipe()); // Criando uma instancia do validationpipe
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
