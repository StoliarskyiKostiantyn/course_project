import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
    };

    const user = new User();
    user.id = 1;
    user.name = 'Test User';
    user.email = 'test@example.com';
    user.password = 'hashedpassword';

    const post = new Post();
    post.id = 1;
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.user = user;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
    jest.spyOn(postRepository, 'create').mockReturnValue(post);
    jest.spyOn(postRepository, 'save').mockResolvedValue(post);

    const result = await service.create(createPostDto, user.id);

    expect(result).toEqual(post);
    expect(result.user).toEqual(user);
  });

  it('should find all posts for a user', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'Test User';
    user.email = 'test@example.com';
    user.password = 'hashedpassword';

    const post1 = new Post();
    post1.id = 1;
    post1.title = 'Test Post 1';
    post1.content = 'This is test post 1';
    post1.user = user;

    const post2 = new Post();
    post2.id = 2;
    post2.title = 'Test Post 2';
    post2.content = 'This is test post 2';
    post2.user = user;

    const posts = [post1, post2];

    jest.spyOn(postRepository, 'find').mockResolvedValue(posts);

    const result = await service.findAll(user.id);

    expect(result).toEqual(posts);
  });
});
