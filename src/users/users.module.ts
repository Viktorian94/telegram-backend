import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from 'src/telegram/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TelegramService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
