import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [TelegramService],
})
export class TelegramModule {}
