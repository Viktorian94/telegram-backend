// import { Test, TestingModule } from '@nestjs/testing';
// import { TelegramService } from './telegram.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UsersService } from '../users/users.service';
// import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/users.entity';
// import { Repository } from 'typeorm';

// describe('TelegramService', () => {
//   let service: TelegramService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot(),
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [User],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([User]),
//       ],
//       providers: [
//         TelegramService,
//         ConfigService,
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     service = module.get<TelegramService>(TelegramService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
