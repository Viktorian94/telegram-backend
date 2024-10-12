import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TelegramService } from '../telegram/telegram.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<User[]> {
    return this.usersService.findAll({ page, limit });
  }

  @Get('search')
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<User[]> {
    return this.usersService.searchUsers(query, { page, limit });
  }
}
@Controller('user-photo')
export class UserController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get(':telegramId')
  async getUserPhoto(
    @Param('telegramId') telegramId: string,
    @Res() res: Response
  ) {
    try {
      const photoStream =
        await this.telegramService.getUserPhotoStream(telegramId);
      if (!photoStream) {
        return res.status(404).send('Фото не знайдено');
      }
      res.setHeader('Content-Type', 'image/jpeg');
      photoStream.pipe(res);
    } catch (error) {
      console.error('Помилка при отримані фото профіля:', error);
      res.status(500).send('Помилка сервера');
    }
  }
}
