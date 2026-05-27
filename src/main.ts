import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuracionServicio = app.get(ConfigService);
  const puerto = configuracionServicio.get<number>('PORT') ?? 4000;

  app.setGlobalPrefix('api', {
    exclude: ['graphql'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();

  await app.listen(puerto);
}
void bootstrap();
