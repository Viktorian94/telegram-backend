import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(userData: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { telegramId: userData.telegramId },
    });

    if (user) {
      user = Object.assign(user, userData);
    } else {
      user = this.usersRepository.create(userData);
    }

    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(options: { page: number; limit: number }): Promise<User[]> {
    const { page, limit } = options;
    return this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async searchUsers(
    query: string,
    options: { page: number; limit: number },
  ): Promise<User[]> {
    const { page, limit } = options;
    return this.usersRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { username: Like(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
