import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Cache } from 'cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PostEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
    };

    const user = {
      id: 1,
      email: 'test@example.com',
    } as RequestWithUser['user'];

    const post = new PostEntity();
    post.id = 1;
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.user = user;

    jest.spyOn(service, 'create').mockResolvedValue(post);

    const result = await controller.create(createPostDto, {
      user,
    } as RequestWithUser);

    expect(result).toEqual(post);
  });

  it('should return cached posts', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
    } as RequestWithUser['user'];

    const post = new PostEntity();
    post.id = 1;
    post.title = 'Test Post';
    post.content = 'This is a test post';
    post.user = user;

    jest.spyOn(cacheManager, 'get').mockResolvedValue([post]);
    jest.spyOn(service, 'create').mockResolvedValue(post);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);
    jest.spyOn(service, 'findAll').mockResolvedValue([post]);

    const result = await controller.findAll({ user } as RequestWithUser);

    expect(result).toEqual([post]);
  });

  it('should return fresh posts if cache is empty', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
    } as RequestWithUser['user'];

    const post = new PostEntity();
    post.id = 1;
    post.title = 'Test Post';
    post.content = 'This is a test post';
    post.user = user;

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(service, 'findAll').mockResolvedValue([post]);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const result = await controller.findAll({ user } as RequestWithUser);

    expect(result).toEqual([post]);
  });
});
