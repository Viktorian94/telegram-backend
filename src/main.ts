import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://telegram-auth-frontend.vercel.app/'],
    credentials: true,
  });

  const telegramService = app.get(TelegramService);
  const bot = telegramService.getBot();
  const webhookPath = telegramService.getWebhookPath();

  const domain =
    process.env.DOMAIN || 'https://telegram-backend-nxsv.onrender.com/';
  await bot.telegram.setWebhook(`${domain}${webhookPath}`);

  app.use(bot.webhookCallback(webhookPath));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
