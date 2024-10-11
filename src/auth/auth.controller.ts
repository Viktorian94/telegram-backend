import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  @Get('telegram/callback')
  async telegramCallback(@Query() data: any, @Res() res: Response) {
    if (!this.checkTelegramAuth(data)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await this.usersService.createOrUpdate({
      telegramId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      photoUrl: data.photo_url,
    });
    return res.redirect(`/profile?userId=${user.id}`);
  }

  private checkTelegramAuth(data: any): boolean {
    const secret = crypto
      .createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();
    const checkString = Object.keys(data)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');
    const hash = crypto
      .createHmac('sha256', secret)
      .update(checkString)
      .digest('hex');
    return hash === data.hash;
  }
}
