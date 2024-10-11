import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

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
