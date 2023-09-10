import { Test } from '@nestjs/testing';
import pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

const PORT = 3002;

describe('App EndToEnd tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
  });

  describe('Test Auth', () => {
    describe('Register', () => {
      it('should register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'test@gmail.com',
            password: '123456',
          })
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      // it.todo('should Login');
    });
  });

  afterAll(async () => {
    app.close();
  });
  it.todo('should Pass test 3');
});
