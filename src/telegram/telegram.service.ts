// src/telegram/telegram.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(botToken);
  }

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      const profileData = ctx.from;

      await this.usersService.createOrUpdate({
        telegramId: profileData.id.toString(),
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        username: profileData.username,
        languageCode: profileData.language_code,
        phoneNumber: null,
        photoUrl: '',
      });

      await ctx.reply(
        `Hello, ${profileData.first_name}! Please, share your number.`,
        Markup.keyboard([Markup.button.contactRequest('📞 Send the number')])
          .oneTime()
          .resize(),
      );
    });

    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;

      if (contact.user_id === ctx.from.id) {
        await this.usersService.createOrUpdate({
          telegramId: ctx.from.id.toString(),
          phoneNumber: contact.phone_number,
        });
        await ctx.reply('Thank you, the number was saved!');
      } else {
        await ctx.reply('Share Your contact.');
      }
    });

    await this.bot.launch();
    console.log('Telegram bot started');
  }
}
