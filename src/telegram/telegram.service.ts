import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private webhookPath: string;
  private app: NestExpressApplication;

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
        'Ласкаво просимо! Будь ласка, поділіться своїм контактом.',
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: 'Поділитися контактом',
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
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

    const domain = this.configService.get<string>('DOMAIN');
    await this.bot.telegram.setWebhook(`${domain}${this.webhookPath}`);

    this.app.use(this.bot.webhookCallback(this.webhookPath));
  }
}
