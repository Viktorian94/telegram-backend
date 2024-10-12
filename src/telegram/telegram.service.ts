import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import axios from 'axios';

@Injectable()
export class TelegramService implements OnModuleInit {
  async getUserPhotoStream(telegramId: string) {
    const photosResponse = await axios.get(
      `https://api.telegram.org/bot${this.botToken}/getUserProfilePhotos`,
      {
        params: {
          user_id: telegramId,
          limit: 1,
        },
      }
    );

    const photos = photosResponse.data.result.photos;
    if (!photos || photos.length === 0) {
      return null;
    }

    const fileId = photos[0][0].file_id;

    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${this.botToken}/getFile`,
      {
        params: {
          file_id: fileId,
        },
      }
    );

    const filePath = fileResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;

    const imageResponse = await axios.get(fileUrl, { responseType: 'stream' });

    return imageResponse.data;
  }

  private bot: Telegraf;
  private webhookPath: string;
  private app: NestExpressApplication;
  private botToken: string;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new Telegraf(botToken);
    this.webhookPath = `/telegram/${botToken}`;
  }

  async setApp(app: NestExpressApplication) {
    this.app = app;
  }

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      await ctx.reply(
        'Ласкаво просимо! Натисніть кнопку нижче, щоб відкрити додаток.',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Відкрити додаток',
                  web_app: {
                    url: 'https://telegram-auth-frontend.vercel.app',
                  },
                },
              ],
            ],
          },
        }
      );
    });

    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;
      await this.usersService.createOrUpdate({
        telegramId: contact.user_id.toString(),
        phoneNumber: contact.phone_number,
        firstName: contact.first_name,
        lastName: contact.last_name,
        username: ctx.from.username,
      });

      await ctx.reply('Дякуємо! Ваш контакт збережено.');
    });

    const domain = process.env.DOMEIN;
    await this.bot.telegram.setWebhook(`${domain}${this.webhookPath}`);

    this.app.use(this.bot.webhookCallback(this.webhookPath));
  }
}
