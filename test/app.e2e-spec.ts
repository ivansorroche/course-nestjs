import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app/app.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dotenv from 'dotenv'
import { execSync } from 'node:child_process';
import { createUserDto } from 'src/users/dto/create-user.dto';

dotenv.config({ path: '.env.test' })

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(() => {
    execSync('npx prisma migrate deploy')
  })

  beforeEach(async () => {

    execSync('cross-env DATABASE_URL=file:./dev-test.db npx prisma migrate deploy')


    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test'
        }),
        TasksModule,
        UsersModule,
        AuthModule,
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', '..', 'files'),
          serveRoot: "/files"
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }))

    prismaService = module.get<PrismaService>(PrismaService)

    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('/user', () => {

    it('/users (POST) - createUser', async () => {
      const createUserDto = {
        name: 'Ivan S B',
        email: 'Ivan@teste.com',
        password: '123321'
      }

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)

      expect(response.body).toEqual({
        id: response.body.id,
        name: 'Ivan S B',
        email: 'Ivan@teste.com'
      })

    });

    it('/users (POST) - weak password', async () => {
      const createUserDto: createUserDto = {
        name: 'Ivan teste',
        email: 'teste@teste.com',
        password: '123',
      }

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400)
    })


  })
});
