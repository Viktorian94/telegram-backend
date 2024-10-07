import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  app.enableCors({
    origin: ['https://telegram-auth-frontend.vercel.app/'],
    credentials: true,
  });
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
