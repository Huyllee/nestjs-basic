import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
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
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should show error with empty email', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: 'a123456',
          })
          .expectStatus(400);
        //.inspect()
      });
      it('should show error with invalid email format', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'hoang@gmail', //invalid email format
            password: 'a123456',
          })
          .expectStatus(400);
        //.inspect()
      });
      it('should show error IF password is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'hoang@gmail.com',
            password: '', //blank password
          })
          .expectStatus(400);
        //.inspect()
      });
      //many other cases...
      it('should Register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@gmail.com',
            password: 'a123456',
          })
          .expectStatus(201);
        //.inspect()
      });
    });

    describe('Login', () => {
      it('should Login', () => {
        return (
          pactum
            .spec()
            .post('/auth/login')
            .withBody({
              email: 'testemail01@gmail.com',
              password: 'a123456',
            })
            .expectStatus(201)
            //.inspect()
            .stores('accessToken', 'accessToken')
        );
      });

      describe('User', () => {
        it('get detail user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: `Bearer $S{accessToken}`,
            })
            .expectStatus(200)
            .stores('userId', 'id');
        });
      });
    });

    describe('Note', () => {
      describe('Insert note', () => {
        it('Insert first note', () => {
          return pactum
            .spec()
            .post('/notes')
            .withHeaders({ Authorization: `Bearer $S{accessToken}` })
            .withBody({
              title: 'test',
              description: 'a123456',
              url: 'ha ha',
            })
            .expectStatus(201)
            .stores('noteId', 'id');
        });

        it('Insert second note', () => {
          return pactum
            .spec()
            .post('/notes')
            .withHeaders({ Authorization: `Bearer $S{accessToken}` })
            .withBody({
              title: 'test 2',
              description: 'a1234567',
              url: 'ha ha',
            })
            .expectStatus(201)
            .stores('noteId2', 'id');
        });

        it('Get all notes', () => {
          return pactum
            .spec()
            .get('/notes')
            .withHeaders({ Authorization: `Bearer $S{accessToken}` })
            .expectStatus(200);
        });

        it('Get note by id', () => {
          return pactum
            .spec()
            .get(`/notes`)
            .withPathParams('id', '$S{noteId}')
            .withHeaders({ Authorization: `Bearer $S{accessToken}` })
            .expectStatus(200);
          // .inspect();
        });

        it('Delete note by id', () => {
          return pactum
            .spec()
            .delete(`/notes`)
            .withQueryParams('id', '$S{noteId2}')
            .withHeaders({ Authorization: `Bearer $S{accessToken}` })
            .expectStatus(204);
        });
      });

      // describe('Get all notes', () => {
      //   it('Get all notes');
      // });

      // describe('Get note by id', () => {
      //   it.todo('test note');
      // });

      // describe('delete note by id', () => {
      //   it.todo('test note');
      // });
    });
  });

  afterAll(async () => {
    app.close();
  });
});
