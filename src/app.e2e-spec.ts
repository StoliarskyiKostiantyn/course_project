import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { CreateUserDto } from './user/dto/create-user.dto';
import { CreatePostDto } from './post/dto/create-post.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', createUserDto.name);
    expect(response.body).toHaveProperty('email', createUserDto.email);
  });

  it('/auth/login (POST)', async () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    jwtToken = response.body.access_token;
  });

  it('/posts (POST)', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
    };

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createPostDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', createPostDto.title);
    expect(response.body).toHaveProperty('content', createPostDto.content);
  });

  it('/posts (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
